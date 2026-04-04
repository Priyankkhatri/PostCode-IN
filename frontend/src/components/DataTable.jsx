import { useNavigate } from "react-router-dom";

const officeTypeColor = {
  HO: "bg-gold/15 text-gold border-gold/30",
  SO: "bg-teal/15 text-teal border-teal/30",
  BO: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

const deliveryColor = {
  Delivery: "bg-green-500/15 text-green-400 border-green-500/30",
  "Non-Delivery": "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function DataTable({ rows, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="divide-y divide-white/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-20" />
              <div className="h-4 bg-white/10 rounded flex-1" />
              <div className="h-4 bg-white/10 rounded w-16" />
              <div className="h-4 bg-white/10 rounded w-24" />
              <div className="h-4 bg-white/10 rounded w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <div className="font-display font-semibold text-lg text-paper/70">No records found</div>
        <div className="text-paper/40 text-sm mt-1">Try adjusting your filters or search query</div>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            {["PIN Code", "Office Name", "Type", "Delivery", "Taluk", "District", "State"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-mono text-xs text-paper/40 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, i) => (
            <tr
              key={row._id || i}
              className="hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => navigate(`/pincode?q=${row.pincode}`)}
            >
              <td className="px-5 py-3.5 font-mono font-medium text-saffron group-hover:underline whitespace-nowrap">
                {row.pincode}
              </td>
              <td className="px-5 py-3.5 text-paper/80 max-w-[200px] truncate">{row.officeName}</td>
              <td className="px-5 py-3.5">
                <span
                  className={`tag border ${
                    officeTypeColor[row.officeType] || "bg-white/10 text-paper/60 border-white/10"
                  }`}
                >
                  {row.officeType || "—"}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`tag border ${
                    deliveryColor[row.deliveryStatus] || "bg-white/10 text-paper/60 border-white/10"
                  }`}
                >
                  {row.deliveryStatus || "—"}
                </span>
              </td>
              <td className="px-5 py-3.5 text-paper/60 whitespace-nowrap">{row.taluk || "—"}</td>
              <td className="px-5 py-3.5 text-paper/60 whitespace-nowrap">{row.districtName || "—"}</td>
              <td className="px-5 py-3.5 text-paper/50 whitespace-nowrap">{row.stateName || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
