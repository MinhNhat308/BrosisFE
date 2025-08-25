// Environment configuration for API endpoints
const getAPIBaseURL = () => {
  // Check for Vite environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback based on environment detection
  const isDevelopment = import.meta.env.DEV || 
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  
  return isDevelopment ? 'http://localhost:8081' : 'https://brosis2025-api.onrender.com';
};

export const API_BASE_URL = getAPIBaseURL();

console.log('Current API Base URL:', API_BASE_URL);
