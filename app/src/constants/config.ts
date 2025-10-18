// Use functions to ensure environment variables are read fresh on each call
export const getApplicationId = () => import.meta.env.VITE_APPLICATION_ID || "37poFMF4VaNgfyeaKdGbiacWsCjySJxrtgakT8EFyVL1";
export const getApplicationPath = () => import.meta.env.VITE_APPLICATION_PATH || "https://calimero-only-peers-dev.s3.amazonaws.com/uploads/03ab62aa4676a3ecd8ca3f9da23e8923.wasm";
export const getContextId = () => import.meta.env.VITE_CONTEXT_ID || "6osrzYwAnkkAWadQBZehY4tytNexmeGWaBu9bT3UgwkF";

// Keep the old exports for backward compatibility, but they won't update dynamically
export const APPLICATION_ID = getApplicationId();
export const APPLICATION_PATH = getApplicationPath();
export const CONTEXT_ID = getContextId();