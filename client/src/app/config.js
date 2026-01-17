// export const BASE_API_URL = 'http://localhost:3001';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const serverUrl = "https://api-assistant.jorgenlt.no";

export const BASE_API_URL = VITE_API_BASE_URL || serverUrl;

if (VITE_API_BASE_URL) {
  console.log("BASE_API_URL: ", VITE_API_BASE_URL);
}
