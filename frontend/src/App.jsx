import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layout & Components
import { Layout } from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import PincodeDetail from "./pages/PincodeDetail";
import About from "./pages/About";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * @app PinIndia
 * @description The main entry point for the Indian Postal Directory & Analytics platform.
 * Features a modern, Light Theme overhaul with React Router v6 and React Query.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pincode/:pincode" element={<PincodeDetail />} />
            <Route path="/about" element={<About />} />
            
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
