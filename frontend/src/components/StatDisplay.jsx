import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "indigo" }) => {
  const colorMap = {
    indigo: "bg-indigo-600 text-indigo-600",
    emerald: "bg-emerald-600 text-emerald-600",
    rose: "bg-rose-600 text-rose-600",
    amber: "bg-amber-600 text-amber-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-50 ${colorMap[color].split(" ")[1]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500 mr-1" />
          )}
          <span className={`text-xs font-semibold ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
            {trendValue}
          </span>
          <span className="text-xs text-slate-400 ml-2">vs last period</span>
        </div>
      )}
    </motion.div>
  );
};

const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-slate-100 h-12 rounded-t-xl mb-1"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-slate-100">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="h-4 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export { StatsCard, TableSkeleton };
