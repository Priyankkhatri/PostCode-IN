import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getPincodeDetail } from "../api";
import LookupField from "../components/LookupField";
import LocationCard from "../components/LocationCard";
import LoadingPulse from "../components/LoadingPulse";
import StatusNotice from "../components/StatusNotice";

/**
 * @page MainSearch
 * @description The primary, centered, search-focused entry point for the application.
 */
export default function MainSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const performSearch = async (pin) => {
    if (!pin || pin.length < 3) return;
    
    setLoading(true);
    setError("");
    setSearched(true);
    setSearchParams({ q: pin });

    try {
      const data = await getPincodeDetail(pin);
      setResults(data);
    } catch (err) {
      setResults([]);
      setError(err.response?.data?.message || "Something went wrong. Please check the PIN code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      performSearch(q);
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch(input.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 lg:py-24 space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <div className="text-center space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="inline-block px-3 py-1 bg-brand/10 text-brand-light rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-brand/20">
          Official Postal Directory
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-content-primary">
          Find Location by PIN Code
        </h1>
        <p className="max-w-2xl mx-auto text-content-secondary text-lg lg:text-xl font-medium leading-relaxed">
          Access comprehensive details for all 155,000+ Indian Post Offices with a single 6-digit code.
        </p>
        
        <div className="pt-6">
          <LookupField 
            value={input} 
            onChange={setInput} 
            onSubmit={handleFormSubmit} 
            loading={loading}
          />
          <p className="mt-4 text-xs font-mono text-content-muted">
            Try: <button onClick={() => { setInput("380001"); performSearch("380001"); }} className="hover:text-brand-light transition-colors underline decoration-brand/30">380001</button> (Ahmedabad), <button onClick={() => { setInput("560001"); performSearch("560001"); }} className="hover:text-brand-light transition-colors underline decoration-brand/30">560001</button> (Bengaluru)
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Results / Status Area */}
      <div className="max-w-4xl mx-auto w-full min-h-[400px]">
        {loading ? (
          <LoadingPulse />
        ) : error ? (
          <StatusNotice type="error" message={error} />
        ) : !searched ? (
          <StatusNotice type="empty" />
        ) : results.length > 0 ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-content-muted">
                    Found {results.length} Office{results.length > 1 ? "s" : ""}
                </h2>
                <div className="text-xs font-mono text-brand-light">
                    Results for {searchParams.get("q")}
                </div>
            </div>
            
            <div className="grid gap-6">
              {results.map((r, i) => (
                <LocationCard key={r._id || i} record={r} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
