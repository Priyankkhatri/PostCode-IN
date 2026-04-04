import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Search, Filter, MapPin, Building2, Download, 
  ChevronLeft, ChevronRight, X, LayoutGrid, List as ListIcon,
  ArrowUpDown
} from "lucide-react";
import { getStatesList, getDistrictsList, getTaluksList, getPincodesList, getExportUrl } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { TableSkeleton } from "../components/TableSkeleton";
import toast from "react-hot-toast";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search/Filter State from URL
  const state = searchParams.get("state") || "";
  const district = searchParams.get("district") || "";
  const taluk = searchParams.get("taluk") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy") || "officeName";
  const order = searchParams.get("order") || "asc";

  // Data States
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Extra state for local search input to allow debouncing
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localQuery !== query) {
        updateParam("q", localQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localQuery, query]);

  // Load Initial States
  useEffect(() => {
    getStatesList().then(setStates).catch(console.error);
  }, []);

  // Chained Filter Loaders
  useEffect(() => {
    if (state) {
      getDistrictsList(state).then(setDistricts).catch(() => setDistricts([]));
    } else {
      setDistricts([]);
      setTaluks([]);
    }
  }, [state]);

  useEffect(() => {
    if (state && district) {
      getTaluksList(state, district).then(setTaluks).catch(() => setTaluks([]));
    } else {
      setTaluks([]);
    }
  }, [state, district]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Deep resets for chained filters
    if (key === "state") { newParams.delete("district"); newParams.delete("taluk"); }
    if (key === "district") { newParams.delete("taluk"); }
    
    // Reset page on ANY filter/search change
    if (key !== "page") {
      newParams.set("page", "1");
    }
    
    setSearchParams(newParams);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPincodesList({
        state, district, taluk, page, q: query, sortBy, order, limit: 15
      });
      setPincodes(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err.message || "Failed to load PIN codes");
    } finally {
      setLoading(false);
    }
  }, [state, district, taluk, page, query, sortBy, order]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReset = () => {
    // Immediate state reset for better UX
    setSearchParams({});
    setLocalQuery("");
    setPincodes([]);
    toast.success("Filters cleared");
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && order === "asc" ? "desc" : "asc";
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", field);
    newParams.set("order", newOrder);
    setSearchParams(newParams);
  };

  // Improved sliding window pagination
  const paginationRange = useMemo(() => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    
    if (end === totalPages) {
        start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
  }, [page, totalPages]);

  return (
    <div className="space-y-10 py-6">
      {/* Search & Statistics Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
            Explore <span className="text-indigo-600">Database</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center">
            {loading ? "Syncing with cloud..." : `${total.toLocaleString()} records found in Indian Postal Directory`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Instant search..."
              className="input-field pl-10"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
          <a 
            href={getExportUrl({ state, district, taluk, q: query })}
            className="btn-secondary flex items-center space-x-2"
            title="Download first 50k matching records"
          >
            <Download className="h-5 w-5" />
            <span>EXPORT CSV</span>
          </a>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "State", value: state, options: states, key: "state" },
          { label: "District", value: district, options: districts, key: "district", disabled: !state },
          { label: "Taluk/Tehsil", value: taluk, options: taluks, key: "taluk", disabled: !district }
        ].map(filter => (
          <div key={filter.key} className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">
               {filter.label}
             </label>
             <select 
               className={`w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 ${filter.disabled ? 'opacity-50 grayscale' : ''}`}
               value={filter.value}
               disabled={filter.disabled}
               onChange={(e) => updateParam(filter.key, e.target.value)}
             >
               <option value="">ALL {filter.label.toUpperCase()}S</option>
               {filter.options.map(opt => (
                 <option key={opt} value={opt}>{opt}</option>
               ))}
             </select>
          </div>
        ))}
        <div className="flex items-end">
           <button 
             onClick={handleReset}
             className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all font-bold text-sm"
           >
             <X className="h-5 w-5" />
             <span>CLEAR FILTERS</span>
           </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {[
                  { label: "OFFICE NAME", key: "officeName" },
                  { label: "PINCODE", key: "pincode" },
                  { label: "TALUK", key: "taluk" },
                  { label: "DISTRICT", key: "districtName" },
                  { label: "STATE", key: "stateName" },
                  { label: "STATUS", key: "deliveryStatus" }
                ].map(col => (
                  <th 
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors group"
                  >
                    <div className="flex items-center space-x-2">
                       <span>{col.label}</span>
                       <ArrowUpDown className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${sortBy === col.key ? 'opacity-100 text-indigo-600' : ''}`} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 relative min-h-[400px]">
              <AnimatePresence initial={false}>
                {loading ? (
                  <TableSkeleton rows={10} cols={6} />
                ) : pincodes.length > 0 ? (
                  pincodes.map((item, idx) => (
                    <motion.tr 
                      key={item._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onClick={() => navigate(`/pincode/${item.pincode}`)}
                      className="group cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                          {item.officeName}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                          {item.pincode}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500 uppercase font-bold">{item.taluk}</td>
                      <td className="px-8 py-6 text-sm text-slate-500 uppercase font-bold">{item.districtName}</td>
                      <td className="px-8 py-6 text-sm text-slate-500 uppercase font-bold">{item.stateName}</td>
                      <td className="px-8 py-6">
                        <span className={`badge ${
                          item.deliveryStatus === "Delivery" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}>
                          {item.deliveryStatus}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center space-y-4">
                       <LayoutGrid className="h-12 w-12 text-slate-200 mx-auto" />
                       <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No records found for current filters</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center space-x-2">
              <button 
                disabled={page <= 1}
                onClick={() => updateParam("page", page - 1)}
                className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="hidden sm:flex items-center space-x-1">
                 {paginationRange.map(pg => (
                    <button 
                      key={pg}
                      onClick={() => updateParam("page", pg)}
                      className={`h-10 w-10 rounded-xl font-bold text-xs transition-all ${
                        pg === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                 ))}
                 {totalPages > 5 && paginationRange[paginationRange.length - 1] < totalPages && (
                     <>
                        <span className="text-slate-300">...</span>
                        <button 
                            onClick={() => updateParam("page", totalPages)}
                            className="h-10 w-10 rounded-xl text-slate-400 font-bold text-xs hover:bg-slate-50"
                        >
                            {totalPages}
                        </button>
                     </>
                 )}
              </div>

              <button 
                disabled={page >= totalPages}
                onClick={() => updateParam("page", page + 1)}
                className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
           </div>

           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              PAGE {page} OF {totalPages || 1}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
