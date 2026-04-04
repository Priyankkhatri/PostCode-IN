import React from "react";

/**
 * @component LocationCard
 * @description A structured, high-contrast card for displaying postal details.
 */
export default function LocationCard({ record }) {
  const typeLabels = {
    HO: { label: "Head Office", themeColor: "border-brand-light/40 text-brand-light" },
    SO: { label: "Sub Office", themeColor: "border-emerald-500/40 text-emerald-400" },
    BO: { label: "Branch Office", themeColor: "border-amber-500/40 text-amber-400" },
  };

  const currentType = typeLabels[record.officeType] || { label: record.officeType, themeColor: "border-slate-700 text-content-secondary" };

  const details = [
    { label: "City/Taluk", value: record.taluk },
    { label: "District", value: record.districtName },
    { label: "State", value: record.stateName },
    { label: "Delivery", value: record.deliveryStatus },
    { label: "Circle", value: record.circleName },
    { label: "Division", value: record.divisionName },
  ].filter(d => d.value && d.value !== "nan" && d.value !== "NA");

  return (
    <div className="location-card group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl font-bold font-mono tracking-tighter text-brand-light">
              {record.pincode}
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${currentType.themeColor}`}>
              {currentType.label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-content-primary">
            {record.officeName}
          </h3>
        </div>
        
        {record.telephone && record.telephone !== "nan" && (
          <div className="flex items-center gap-2 text-content-muted text-sm border-l sm:border-l-0 sm:border-t-0 pl-4 sm:pl-0 border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="font-mono">{record.telephone}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800/60">
        {details.map((detail, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-content-muted/60">
              {detail.label}
            </div>
            <div className="text-content-secondary font-medium truncate" title={detail.value}>
              {detail.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
