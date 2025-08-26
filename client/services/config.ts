// Environment configuration for API endpoints
const getAPIBaseURL = () => {
  // Debug logging
  console.log('Environment variables:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
  
  // Check for Vite environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback based on environment detection
  const isDevelopment = import.meta.env.DEV || 
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  
  return isDevelopment ? 'http://localhost:8081' : 'https://brosisbe.onrender.com';
};

export const API_BASE_URL = getAPIBaseURL();

console.log('Current API Base URL:', API_BASE_URL);
