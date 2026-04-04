export default function StatsCard({ label, value, icon, delay = 0, accent = "saffron" }) {
  const accentMap = {
    saffron: "from-saffron/20 to-transparent border-saffron/30 text-saffron",
    teal: "from-teal/20 to-transparent border-teal/30 text-teal",
    gold: "from-gold/20 to-transparent border-gold/30 text-gold",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400",
  };
  const style = accentMap[accent] || accentMap.saffron;

  return (
    <div
      className={`card p-6 bg-gradient-to-br ${style} animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10`}>
          LIVE
        </span>
      </div>
      <div className="font-display font-bold text-3xl text-paper mb-1">
        {value !== undefined && value !== null
          ? Number(value).toLocaleString("en-IN")
          : "—"}
      </div>
      <div className="text-paper/50 font-body text-sm">{label}</div>
    </div>
  );
}
