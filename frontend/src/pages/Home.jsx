import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, ArrowRight, TrendingUp, Hash, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { searchPincodes } from "../api";
import { debounce } from "lodash";

const Home = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const stats = [
    { label: "Total PINs", value: "154,823", icon: Hash },
    { label: "Regional Coverage", value: "36 States/UTs", icon: Globe },
    { label: "Daily Speed", value: "Fast & Precise", icon: TrendingUp },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${query.trim()}`);
    }
  };

  const getSuggestions = async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchPincodes(q);
      setSuggestions(data.slice(0, 6)); // Top 6 suggestions
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedGetSuggestions = useRef(debounce(getSuggestions, 300)).current;

  useEffect(() => {
    debouncedGetSuggestions(query);
  }, [query]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 animate-fade-in">
      {/* Hero Content */}
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          India Post Directory &bull; Real-time Access
        </motion.div>
        
        <motion.h1 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight"
        >
          Explore Your <span className="text-indigo-600">Postal Universe</span>
        </motion.h1>
        
        <motion.p 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.15 }}
           className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto"
        >
          The most extensive and precise Pin code search engine for India. 
          Access 154,000+ locations, analytical distributions, and detailed office stats.
        </motion.p>
      </div>

      {/* Main Search Bar */}
      <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="w-full max-w-3xl px-4 relative"
         ref={searchRef}
      >
        <form onSubmit={handleSearch} className="group relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600" />
          </div>
          <input
            type="text"
            className="w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-xl text-slate-800 placeholder:text-slate-400 transition-all font-medium"
            placeholder="Search by PIN, Area, or District..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center group/btn"
          >
            Search
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </form>

        {/* Suggestion Dropdown */}
        <AnimatePresence>
          {showSuggestions && (query.length >= 2) && (suggestions.length > 0 || loading) && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="absolute top-full left-4 right-4 mt-4 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
            >
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-medium">Searching clusters...</div>
              ) : (
                <div className="p-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/pincode/${item.pincode}`)}
                      className="w-full flex items-center px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
                         <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">{item.officeName}</span>
                        <span className="text-sm text-slate-400 mt-1 uppercase">
                           {item.pincode} &bull; {item.districtName}, {item.stateName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center space-x-6 p-6 rounded-2xl bg-white/50 border border-slate-100 hover:bg-white transition-all cursor-default group"
          >
            <div className="p-3 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
               <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <Link to="/explore" className="text-slate-400 hover:text-indigo-600 text-sm font-bold uppercase tracking-widest flex items-center transition-colors">
         Browse Advanced Catalog <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
};

export default Home;
