import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

// ============ ML SERVICE API (Status & Initialization) ============
export const checkMLHealth = async () => {
    // Matches router.get("/health", checkHealth) in predictionRoutes.js
    try {
        const response = await api.get('/predictions/health');
        return response.data;
    } catch (error) {
            // If the request fails, return offline so the UI can show the error
            return { status: "offline" };
        }
};

export const getSymptoms = async () => {
    // Matches router.get("/symptoms", getSymptomsList) in predictionRoutes.js
    const response = await api.get('/predictions/symptoms');
    return response.data;
};

// ============ PREDICTION API (Submitting Data) ============
export const predictDisease = async (symptoms, userData = {}) => {
    // Matches router.post("/symptoms", protect, predictSymptoms)
    const response = await api.post('/predictions/symptoms', {
        symptoms,
        age: userData.age,
        temperature: userData.temperature,
        bp: userData.bp
    });
    return response.data;
};

export const predictByReport = async (reportData, userData = {}) => {
    // Matches router.post("/report", protect, predictReport)
    const response = await api.post('/predictions/report', {
        report_data: reportData,
        age: userData.age,
        bp: userData.bp
    });
    return response.data;
};

// ============ HISTORY API (Managing Records) ============
export const getHistory = async () => {
    // Matches router.get("/history", protect, getHistory)
    const response = await api.get('/predictions/history');
    return response.data;
};

export const getPredictionRecord = async (id) => {
    // Matches router.get("/:id", protect, getRecord)
    const response = await api.get(`/predictions/${id}`);
    return response.data;
};

export const deletePredictionRecord = async (id) => {
    // Matches router.delete("/:id", protect, deleteRecord)
    const response = await api.delete(`/predictions/${id}`);
    return response.data;
};

// ============ AUTH API ============
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export default api;