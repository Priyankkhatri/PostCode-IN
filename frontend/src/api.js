import axios from "axios";

/**
 * @api PIN_API
 * @description Centralized API interaction for postal data.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    
    // Log the error for internal debugging
    console.error(`📡 API Error [${error.config?.url}]:`, message);
    
    // Wrap the error so components can access the clean message
    return Promise.reject(new Error(message));
  }
);

/**
 * @desc 1. Get all unique state names
 */
export const getStatesList = async () => {
  const { data } = await api.get("/states");
  return data.data;
};

/**
 * @desc 2. Get districts for a specific state
 */
export const getDistrictsList = async (state) => {
  const { data } = await api.get(`/states/${state.toUpperCase()}/districts`);
  return data.data;
};

/**
 * @desc 3. Get taluks for a state + district combo
 */
export const getTaluksList = async (state, district) => {
  const { data } = await api.get(`/states/${state.toUpperCase()}/districts/${encodeURIComponent(district)}/taluks`);
  return data.data;
};

/**
 * @desc 4. Main paginated/filtered pincode list
 */
export const getPincodesList = async (params) => {
  const { data } = await api.get("/", { params });
  return data;
};

/**
 * @desc 5. Full-text search across multiple fields
 */
export const searchPincodes = async (q) => {
  const { data } = await api.get("/search", { params: { q } });
  return data.data;
};

/**
 * @desc 6. Detailed information for a single pincode
 */
export const getPincodeDetail = async (pincode) => {
  const { data } = await api.get(`/pincode/${pincode}`);
  return data;
};

/**
 * @desc 7. Dashboard aggregate numbers
 */
export const getStatsOverview = async () => {
  const { data } = await api.get("/stats");
  return data.data;
};

/**
 * @desc 8. State-wise distribution for charts
 */
export const getStateDistribution = async () => {
  const { data } = await api.get("/stats/state-distribution");
  return data.data;
};

/**
 * @desc 9. Delivery vs Non-delivery split
 */
export const getDeliveryDistribution = async () => {
  const { data } = await api.get("/stats/delivery-distribution");
  return data.data;
};

/**
 * @desc 10. Direct link generator for CSV export
 */
export const getExportUrl = (filters) => {
  const query = new URLSearchParams(filters).toString();
  const baseURL = api.defaults.baseURL.replace(/\/$/, ""); // Remove trailing slash
  return `${baseURL}/export?${query}`;
};

export default api;
