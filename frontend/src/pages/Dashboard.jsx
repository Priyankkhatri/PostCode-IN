import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getStatsOverview, 
  getStateDistribution, 
  getDeliveryDistribution 
} from "../api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { StatsCard } from "../components/StatDisplay";
import { 
  Map as MapIcon, Database, CheckCircle2, 
  AlertCircle, Activity, LayoutDashboard 
} from "lucide-react";
import toast from "react-hot-toast";

const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [stateDist, setStateDist] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, distData, deliveryData] = await Promise.all([
          getStatsOverview(),
          getStateDistribution(),
          getDeliveryDistribution(),
        ]);
        setStats(statsData);
        setStateDist(distData);
        
        // Prepare Pie Chart data correctly
        setDeliveryDist([
          { name: "Delivery", value: Number(deliveryData.delivery) },
          { name: "Non-Delivery", value: Number(deliveryData.nonDelivery) },
        ]);
      } catch (err) {
        toast.error("Failed to sync analytics dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 py-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white rounded-3xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-3xl"></div>
          <div className="h-96 bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
         <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
            <LayoutDashboard className="h-8 w-8 text-white" />
         </div>
         <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              Network <span className="text-indigo-600">Analytics</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Real-time visualization of 154,823 postal nodes</p>
         </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total PIN Codes" 
          value={stats?.totalPincodes} 
          icon={Database} 
          trend="up" 
          trendValue="+1.2%" 
          color="indigo"
        />
        <StatsCard 
          title="Unique States" 
          value={stats?.totalStates} 
          icon={MapIcon} 
          trend="up"
          trendValue="100%" 
          color="indigo"
        />
        <StatsCard 
          title="Delivery Nodes" 
          value={stats?.deliveryOffices} 
          icon={CheckCircle2} 
          trend="up" 
          trendValue="Active" 
          color="emerald"
        />
        <StatsCard 
          title="Registry Districts" 
          value={stats?.totalDistricts} 
          icon={Activity} 
          trend="up" 
          trendValue="Verified" 
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: State Distribution */}
        <div className="card p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase">State-wise Distribution</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 15 States</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="state" 
                   tick={{fontSize: 10, fontWeight: 700, fill: "#94a3b8"}} 
                   axisLine={false}
                   tickLine={false}
                />
                <YAxis 
                   tick={{fontSize: 10, fontWeight: 700, fill: "#94a3b8"}}
                   axisLine={false}
                   tickLine={false}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   cursor={{ fill: '#f8fafc' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#4f46e5" 
                  radius={[6, 6, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Delivery Split */}
        <div className="card p-10 space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-black text-slate-900 uppercase">Operational Split</h3>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Status</span>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {deliveryDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
             <h3 className="text-2xl font-black tracking-tight uppercase italic">Ready to <span className="text-indigo-400">Deep Dive?</span></h3>
             <p className="text-slate-400 text-sm font-medium">Detailed filtration and regional discovery tools are available in the Explore tab.</p>
          </div>
          <button 
             onClick={() => navigate("/explore")}
             className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
          >
             EXPLORE DATA
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
