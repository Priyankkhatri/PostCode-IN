import React from "react";

/**
 * @component LookupField
 * @description A clean, minimalist search input field for pincode entry.
 */
export default function LookupField({ value, onChange, onSubmit, loading }) {
  return (
    <form 
      onSubmit={onSubmit} 
      className="max-w-2xl mx-auto w-full flex flex-col sm:flex-row gap-3 transition-opacity duration-300"
    >
      <div className="relative flex-1 group">
        <input
          type="text"
          className="field-input text-lg font-mono tracking-wider tabular-nums"
          placeholder="Enter 6-digit PIN code..."
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          disabled={loading}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-content-muted/40 pointer-events-none group-focus-within:text-brand-light/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>
      
      <button
        type="submit"
        className="action-btn sm:px-10 whitespace-nowrap"
        disabled={loading || value.length < 3}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Searching...</span>
          </div>
        ) : (
          "Find Location"
        )}
      </button>
    </form>
  );
}
