// export const BASE_API_URL = 'http://localhost:3001';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const serverUrl = "https://assistant-a64w.onrender.com";

export const BASE_API_URL = VITE_API_BASE_URL || serverUrl;
