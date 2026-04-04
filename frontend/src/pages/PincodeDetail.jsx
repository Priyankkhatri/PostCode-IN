import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Copy, Check, MapPin, Building2, 
  Navigation, Info, Hash, Phone, ExternalLink 
} from "lucide-react";
import { getPincodeDetail } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PincodeDetail = () => {
  const { pincode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPincodeDetail(pincode);
        setData(res.data);
        setNearby(res.nearbyPincodes || []);
        window.scrollTo(0, 0);
      } catch (err) {
        toast.error("Pincode information not found");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pincode, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pincode);
    setCopied(true);
    toast.success("PIN copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
     return (
       <div className="max-w-4xl mx-auto space-y-8 animate-pulse pt-8">
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-64 bg-white rounded-3xl border border-slate-100"></div>
          <div className="h-32 bg-slate-100 rounded-3xl"></div>
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          BACK TO EXPLORE
        </button>

        <div className="flex items-center space-x-4">
           <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-indigo-200 flex items-center space-x-3">
              <Hash className="h-5 w-5 opacity-70" />
              <span className="text-3xl font-black font-mono tracking-tighter">{pincode}</span>
           </div>
           <button 
             onClick={handleCopy}
             className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all active:scale-95"
           >
             {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6" />}
           </button>
        </div>
      </div>

      {/* Office Cards List */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold flex items-center text-slate-900 px-2 uppercase tracking-widest text-xs">
           <Building2 className="mr-2 h-4 w-4 text-indigo-600" />
           Postal Offices ({data?.length})
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
           {data?.map((office, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="card p-8 group border-2 border-transparent hover:border-indigo-100"
             >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className={`badge mb-3 ${
                        office.deliveryStatus === "Delivery" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {office.deliveryStatus} Status
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                        {office.officeName}
                      </h3>
                      <p className="text-slate-500 font-mono text-sm mt-1">{office.officeType} Office &bull; {office.circleName} Circle</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
                       <div className="flex items-center text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                          <span> Taluk: <b className="text-slate-900 font-bold uppercase">{office.taluk}</b></span>
                       </div>
                       <div className="flex items-center text-slate-600">
                          <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                          <span> District: <b className="text-slate-900 font-bold uppercase">{office.districtName}</b></span>
                       </div>
                       <div className="flex items-center text-slate-600">
                          <Navigation className="h-4 w-4 mr-2 text-slate-400" />
                          <span> Division: <b className="text-slate-900 font-bold uppercase">{office.divisionName}</b></span>
                       </div>
                       <div className="flex items-center text-slate-600">
                          <Info className="h-4 w-4 mr-2 text-slate-400" />
                          <span> Region: <b className="text-slate-900 font-bold uppercase">{office.regionName}</b></span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">State Primary Location</p>
                       <p className="text-lg font-black text-slate-900 tracking-tight uppercase">{office.stateName}</p>
                    </div>
                    {office.telephone && (
                        <div className="flex items-center justify-center text-indigo-600 text-xs font-bold font-mono">
                            <Phone className="h-3 w-3 mr-1" />
                            {office.telephone}
                        </div>
                    )}
                  </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Nearby Pincodes */}
      {nearby.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
               <h3 className="text-2xl font-black tracking-tight">Nearby Locations</h3>
               <p className="text-slate-400 text-sm font-medium">Other pincodes discovered within same district.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
               {nearby.map(pin => (
                 <button 
                    key={pin}
                    onClick={() => navigate(`/pincode/${pin}`)}
                    className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono font-bold transition-all hover:scale-105 active:scale-95"
                 >
                    {pin}
                 </button>
               ))}
               <button 
                 onClick={() => navigate("/explore")}
                 className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-colors"
               >
                  <ExternalLink className="h-5 w-5" />
               </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Meta */}
      <div className="text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
            Authentic Postal Data &bull; Verification Index: {Math.random().toString(36).substring(7).toUpperCase()}
         </p>
      </div>
    </div>
  );
};

export default PincodeDetail;
