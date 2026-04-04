import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getPincodeDetail } from "../api";

const officeTypeLabel = {
  HO: { label: "Head Office", color: "text-gold" },
  SO: { label: "Sub Office", color: "text-teal" },
  BO: { label: "Branch Office", color: "text-purple-400" },
};

function DetailCard({ record, index }) {
  const typeInfo = officeTypeLabel[record.officeType] || { label: record.officeType, color: "text-paper/60" };

  return (
    <div
      className="card p-6 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="font-mono text-3xl font-bold text-saffron">{record.pincode}</div>
          <div className="font-display font-semibold text-lg text-paper mt-1">{record.officeName}</div>
        </div>
        <span className={`tag border bg-white/5 border-white/10 ${typeInfo.color} text-xs`}>
          {typeInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          ["Delivery Status", record.deliveryStatus],
          ["Taluk", record.taluk],
          ["District", record.districtName],
          ["State", record.stateName],
          ["Division", record.divisionName],
          ["Region", record.regionName],
          ["Circle", record.circleName],
          ["Telephone", record.telephone],
          ["Related Sub Office", record.relatedSubOffice],
          ["Related Head Office", record.relatedHeadOffice],
        ]
          .filter(([, v]) => v && v !== "nan" && v !== "NA")
          .map(([label, value]) => (
            <div key={label}>
              <div className="text-xs font-mono text-paper/35 uppercase tracking-wider mb-0.5">{label}</div>
              <div className="text-paper/80">{value}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function PincodeLookup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const doSearch = (pin) => {
    if (!pin || pin.length < 3) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setSearchParams({ q: pin });
    getPincodeDetail(pin)
      .then(setResults)
      .catch((e) => {
        setResults([]);
        setError(e.response?.data?.message || "PIN code not found. Please check and try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      doSearch(q);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(input.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">Lookup</span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <h1 className="font-display font-bold text-4xl text-paper">PIN Code Lookup</h1>
        <p className="text-paper/50 mt-2 font-body">
          Enter any 6-digit Indian PIN code to get full postal details
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="animate-fade-up-delay-1 mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            className="input text-xl font-mono tracking-widest"
            placeholder="e.g. 380001"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <button
            type="submit"
            className="btn-primary text-base px-7 whitespace-nowrap"
            disabled={loading || input.length < 3}
          >
            {loading ? "…" : "Search"}
          </button>
        </div>
        <p className="text-paper/30 text-xs mt-2 font-mono">6 digits · e.g. 380001 for Ahmedabad GPO</p>
      </form>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-8 bg-white/10 rounded w-32 mb-2" />
              <div className="h-5 bg-white/10 rounded w-56 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-4 bg-white/10 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card border border-red-500/30 bg-red-500/5 p-6 flex items-center gap-4 animate-fade-up">
          <span className="text-3xl">🚫</span>
          <div>
            <div className="font-display font-semibold text-red-400">Not Found</div>
            <div className="text-paper/60 text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-paper/40">
              {results.length} office{results.length > 1 ? "s" : ""} found for{" "}
              <span className="font-mono text-saffron">{input}</span>
            </span>
          </div>
          <div className="space-y-4">
            {results.map((r, i) => (
              <DetailCard key={r._id || i} record={r} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state before search */}
      {!loading && !searched && (
        <div className="text-center py-16 animate-fade-up-delay-2">
          <div className="text-7xl mb-4">📮</div>
          <div className="font-display text-xl text-paper/30">Enter a PIN code above to get started</div>
        </div>
      )}
    </div>
  );
}
