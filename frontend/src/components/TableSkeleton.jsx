import React from "react";
import { motion } from "framer-motion";

/**
 * @component TableSkeleton
 * @description A modern, animated skeleton loader for data tables.
 * Used during data fetching to maintain layout structure and provide visual feedback.
 */
export const TableSkeleton = ({ rows = 10, cols = 6 }) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <motion.tr 
          key={`skeleton-${rowIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="border-b border-slate-50 last:border-0"
        >
          {[...Array(cols)].map((_, colIndex) => (
            <td key={colIndex} className="px-8 py-6">
              <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full"></div>
            </td>
          ))}
        </motion.tr>
      ))}
    </>
  );
};
