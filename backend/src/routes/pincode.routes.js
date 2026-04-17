const express = require("express");
const router = express.Router();
const controller = require("../controllers/pincode.controller");

// Core Lookups
router.get("/states", controller.getStates);
router.get("/states/:state/districts", controller.getDistricts);
router.get("/states/:state/districts/:district/taluks", controller.getTaluks);

// Search & Filtering
router.get("/search", controller.searchPincodes);
router.get("/pincode/:pincode", controller.getPincodeDetail);
router.get("/pincodes", controller.getFilteredPincodes);

// Analytics
router.get("/stats", controller.getStats);
router.get("/stats/state-distribution", controller.getStateDistribution);
router.get("/stats/delivery-distribution", controller.getDeliveryDistribution);

// Export
router.get("/export", controller.exportCSV);

module.exports = router;
