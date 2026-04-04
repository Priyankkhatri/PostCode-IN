import React from "react";
import { Package, Smartphone, ShieldCheck, Database, Layout, Globe, Search, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4 transition-transform group-hover:scale-110">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const About = () => {
  const features = [
    {
      icon: Search,
      title: "Universal Search",
      description: "Blazing fast search across Office Name, District, and State with debounced input technology.",
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Interactive distribution charts showing state-wise postal density and office delivery status.",
    },
    {
      icon: Globe,
      title: "Complete Coverage",
      description: "Data strictly powered by India Post, covering all 154,000+ PIN codes across all 36 States/UTs.",
    },
    {
      icon: ShieldCheck,
      title: "Case Insensitive Data",
      description: "Seamless filtering where inputs are automatically normalized to match the database records.",
    },
    {
      icon: Layout,
      title: "Modular UI",
      description: "Built with React and Tailwind CSS for a modern, fluid experience across all screen sizes.",
    },
    {
      icon: Database,
      title: "Optimized Backend",
      description: "Node.js and MongoDB Atlas with advanced indexing for sub-second retrieval of massive datasets.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100"
        >
          <Package className="h-4 w-4 mr-2" />
          Version 2.0 Released
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Exploring India's <span className="text-indigo-600">Postal Network</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium">
          A high-performance Pin code lookup and analytics platform designed for researchers, 
          developers, and citizens to explore the vast logistics infrastructure of India.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>

      {/* Tech Stack Quote */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Database className="h-48 w-48 text-white -rotate-12" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-6">Designed with Precision</h3>
        <div className="flex flex-wrap justify-center gap-4 text-slate-400 font-mono text-sm">
           <span className="px-3 py-1 border border-slate-700 rounded-full">MongoDB Atlas</span>
           <span className="px-3 py-1 border border-slate-700 rounded-full">Express.js</span>
           <span className="px-3 py-1 border border-slate-700 rounded-full">React 18</span>
           <span className="px-3 py-1 border border-slate-700 rounded-full">Node.js</span>
           <span className="px-3 py-1 border border-slate-700 rounded-full">Tailwind CSS</span>
        </div>
        <p className="mt-8 text-slate-500 text-xs uppercase tracking-widest font-bold">
           Built for performance &bull; Powered by India Post &bull; 2026
        </p>
      </motion.div>

      {/* Legalish Section */}
      <div className="text-center text-slate-400 text-sm max-w-2xl mx-auto italic">
        <p>
          Note: This is a community project and is not officially affiliated with the Department 
          of Posts, Ministry of Communications, Government of India. Data is periodically synced 
          with official public records.
        </p>
      </div>
    </div>
  );
};

export default About;
