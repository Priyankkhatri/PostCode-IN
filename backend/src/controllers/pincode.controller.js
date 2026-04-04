const Pincode = require("../models/Pincode");
const { Parser } = require("json2csv");

// Simple in-memory cache for expensive/static requests
const cache = {
  states: { data: null, timestamp: 0 },
  stats: { data: null, timestamp: 0 },
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * @desc 1. Get all unique state names
 * @route GET /api/states
 */
const getStates = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cache.states.data && now - cache.states.timestamp < CACHE_DURATION) {
      return res.status(200).json({ success: true, data: cache.states.data });
    }

    const states = await Pincode.distinct("stateName");
    const sortedStates = states.filter(Boolean).sort();

    cache.states = { data: sortedStates, timestamp: now };
    res.status(200).json({ success: true, data: sortedStates });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 2. Get districts for a state
 * @route GET /api/states/:state/districts
 */
const getDistricts = async (req, res, next) => {
  try {
    const { state } = req.params;
    const districts = await Pincode.distinct("districtName", {
      stateName: state.toUpperCase(),
    });

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No districts found for state: ${state}`,
      });
    }

    res.status(200).json({ success: true, data: districts.sort() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 3. Get taluks for a state + district
 * @route GET /api/states/:state/districts/:district/taluks
 */
const getTaluks = async (req, res, next) => {
  try {
    const { state, district } = req.params;
    const taluks = await Pincode.distinct("taluk", {
      stateName: state.toUpperCase(),
      districtName: district, // Match exact case from parent lookup
    });

    res.status(200).json({ success: true, data: taluks.sort() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 4. Main Filter API with pagination and sorting
 * @route GET /api/pincodes
 */
const getFilteredPincodes = async (req, res, next) => {
  try {
    const {
      state,
      district,
      taluk,
      page = 1,
      limit = 20,
      sortBy = "officeName",
      order = "asc",
      q,
    } = req.query;

    const filter = {};
    if (state) filter.stateName = state.toUpperCase();
    if (district) filter.districtName = district;
    if (taluk) filter.taluk = taluk;

    // Add universal search query support if provided
    if (q && q.length >= 2) {
      const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchFilter = !isNaN(q) && q.length === 6 
        ? { pincode: Number(q) }
        : {
            $or: [
              { officeName: { $regex: safeQuery, $options: "i" } },
              { districtName: { $regex: safeQuery, $options: "i" } },
              { taluk: { $regex: safeQuery, $options: "i" } },
              { stateName: { $regex: safeQuery, $options: "i" } },
            ],
          };
      
      // Merge search filter with existing categorical filters
      Object.assign(filter, searchFilter);
    }

    // Validate sortBy field to prevent injection/errors
    const allowedSortFields = ["officeName", "pincode", "districtName", "stateName", "taluk", "deliveryStatus"];
    const activeSortField = allowedSortFields.includes(sortBy) ? sortBy : "officeName";

    const sortOptions = {};
    sortOptions[activeSortField] = order === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Pincode.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Pincode.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 5. Universal search (top 20 results)
 * @route GET /api/search
 */
const searchPincodes = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    let searchQuery;
    if (!isNaN(q) && q.length === 6) {
      searchQuery = { pincode: Number(q) };
    } else {
      // Escape special regex characters to prevent API crashes
      const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      
      searchQuery = {
        $or: [
          { officeName: { $regex: safeQuery, $options: "i" } },
          { districtName: { $regex: safeQuery, $options: "i" } },
          { taluk: { $regex: safeQuery, $options: "i" } },
          { stateName: { $regex: safeQuery, $options: "i" } },
        ],
      };
    }

    const data = await Pincode.find(searchQuery).limit(20).lean();

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 6. Detail by pincode + nearby pincodes
 * @route GET /api/pincode/:pincode
 */
const getPincodeDetail = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    if (pincode.length !== 6 || isNaN(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 6 digits",
      });
    }

    const offices = await Pincode.find({ pincode: Number(pincode) }).lean();

    if (!offices || offices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pincode not found",
      });
    }

    // Enhancement: Find 5 nearby pincodes from same district
    // Using exact case matching from the found office's district record
    const nearby = await Pincode.distinct("pincode", {
      districtName: offices[0].districtName,
      pincode: { $ne: Number(pincode) },
    });

    res.status(200).json({
      success: true,
      data: offices,
      nearbyPincodes: nearby.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 7. Dashboard stats
 * @route GET /api/stats
 */
const getStats = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cache.stats.data && now - cache.stats.timestamp < CACHE_DURATION) {
      return res.status(200).json({ success: true, data: cache.stats.data });
    }

    const [totalPincodes, totalStates, totalDistricts, totalTaluks, deliveryOffices, nonDeliveryOffices] =
      await Promise.all([
        Pincode.countDocuments(),
        Pincode.distinct("stateName").then((s) => s.length),
        Pincode.distinct("districtName").then((d) => d.length),
        Pincode.distinct("taluk").then((t) => t.length),
        Pincode.countDocuments({ deliveryStatus: "Delivery" }),
        Pincode.countDocuments({ deliveryStatus: "Non-Delivery" }),
      ]);

    const statsData = {
      totalPincodes,
      totalStates,
      totalDistricts,
      totalTaluks,
      deliveryOffices,
      nonDeliveryOffices,
    };

    cache.stats = { data: statsData, timestamp: now };
    res.status(200).json({ success: true, data: statsData });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 8. State distribution for bar chart
 * @route GET /api/stats/state-distribution
 */
const getStateDistribution = async (req, res, next) => {
  try {
    const total = await Pincode.countDocuments();
    const distribution = await Pincode.aggregate([
      { $group: { _id: "$stateName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    const data = distribution.map((item) => ({
      state: item._id,
      count: item.count,
      percentage: ((item.count / total) * 100).toFixed(2),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 9. Delivery split for pie chart
 * @route GET /api/stats/delivery-distribution
 */
const getDeliveryDistribution = async (req, res, next) => {
  try {
    const total = await Pincode.countDocuments();
    const delivery = await Pincode.countDocuments({ deliveryStatus: "Delivery" });
    const nonDelivery = total - delivery;

    res.status(200).json({
      success: true,
      data: {
        delivery,
        nonDelivery,
        deliveryPercent: ((delivery / total) * 100).toFixed(2),
        nonDeliveryPercent: ((nonDelivery / total) * 100).toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc 10. Export data to CSV
 * @route GET /api/export
 */
const exportCSV = async (req, res, next) => {
  try {
    const { state, district, taluk } = req.query;
    const filter = {};
    if (state) filter.stateName = state.toUpperCase();
    if (district) filter.districtName = district;
    if (taluk) filter.taluk = taluk;

    const data = await Pincode.find(filter).limit(50000).lean();

    const fields = [
      "pincode",
      "officeName",
      "officeType",
      "deliveryStatus",
      "districtName",
      "taluk",
      "stateName",
      "divisionName",
      "regionName",
      "circleName",
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("pincodes.csv");
    if (data.length === 50000) {
        res.header("X-Warning", "Export truncated to 50,000 records");
    }
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStates,
  getDistricts,
  getTaluks,
  getFilteredPincodes,
  searchPincodes,
  getPincodeDetail,
  getStats,
  getStateDistribution,
  getDeliveryDistribution,
  exportCSV,
};
