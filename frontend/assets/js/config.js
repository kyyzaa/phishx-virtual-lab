// API Configuration for PhishX Virtual Lab
const CONFIG = {
    // API Base URL - akan otomatis detect environment
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3002/api'  // Development (updated port)
        : 'https://phishx-virtual-lab-production.up.railway.app/api',  // Production Railway URL

    // Local storage keys
    STORAGE_KEYS: {
        TOKEN: 'phishx_token',
        USER: 'phishx_user'
    },

    // API endpoints
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        UPDATE_PROFILE: '/auth/profile',

        // Quiz endpoints
        SUBMIT_QUIZ: '/quiz/submit',
        QUIZ_RESULTS: '/quiz/results',
        QUIZ_STATS: '/quiz/stats'
    },

    // Quiz types
    QUIZ_TYPES: {
        BASIC: 'phishing-basic',
        ADVANCED: 'phishing-advanced'
    },

    // UI Messages
    MESSAGES: {
        LOGIN_REQUIRED: 'Please login to save your quiz results',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        QUIZ_SAVED: 'Quiz result saved successfully!',
        LOGIN_SUCCESS: 'Login successful!',
        LOGOUT_SUCCESS: 'Logged out successfully'
    }
};

// Utility functions
const API = {
    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },

    // Set auth token
    setToken(token) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    },

    // Remove auth token
    removeToken() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    },

    // Get user data
    getUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },

    // Set user data
    setUser(user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },

    // Remove user data
    removeUser() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // Make authenticated API request
    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, finalOptions);
            
            // Handle token expiration
            if (response.status === 401) {
                this.removeToken();
                this.removeUser();
                window.location.href = 'login.html';
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request error:', error);
            throw error;
        }
    }
};