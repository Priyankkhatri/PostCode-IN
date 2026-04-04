import React from "react";

/**
 * @component StatusNotice
 * @description A professional, clean notification/description for different states (empty, error, etc.).
 */
export default function StatusNotice({ type = "empty", message, title }) {
  const themes = {
    empty: {
      icon: "🔍",
      title: title || "Start Your Search",
      desc: message || "Enter a 6-digit Indian PIN code to locate administrative and postal details.",
      bg: "bg-background-alt/50",
      border: "border-slate-800",
    },
    error: {
      icon: "⚠️",
      title: title || "Location Not Found",
      desc: message || "We couldn't find any records for that PIN code. Please double-check and try again.",
      bg: "bg-red-500/5",
      border: "border-red-500/20",
    },
    count: {
        icon: "📍",
        title: title || "Offices Found",
        desc: message,
        bg: "bg-brand/5",
        border: "border-brand/20",
    }
  };

  const current = themes[type] || themes.empty;

  return (
    <div className={`p-8 rounded-2xl border text-center transition-all ${current.bg} ${current.border}`}>
      <div className="text-4xl mb-4">{current.icon}</div>
      <h3 className="text-lg font-bold text-content-primary mb-2">{current.title}</h3>
      <p className="max-w-md mx-auto text-sm text-content-muted leading-relaxed">
        {current.desc}
      </p>
    </div>
  );
}
