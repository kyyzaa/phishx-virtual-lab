// Authentication functions for PhishX Virtual Lab
// This file should be included in pages that need auth functionality

class AuthManager {
    constructor() {
        this.initializeAuth();
    }

    // Initialize authentication state
    initializeAuth() {
        this.updateUIBasedOnAuth();
    }

    // Register new user
    async register(formData) {
        try {
            const response = await API.request(CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName
                })
            });

            // Save token and user data
            API.setToken(response.token);
            API.setUser(response.user);

            this.updateUIBasedOnAuth();
            return { success: true, message: 'Registration successful!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(formData) {
        try {
            const response = await API.request(CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            // Save token and user data
            API.setToken(response.token);
            API.setUser(response.user);

            this.updateUIBasedOnAuth();
            return { success: true, message: CONFIG.MESSAGES.LOGIN_SUCCESS };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            // Call logout endpoint (optional, for server-side cleanup)
            await API.request(CONFIG.ENDPOINTS.LOGOUT, { method: 'POST' });
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Always clear local storage
            API.removeToken();
            API.removeUser();
            this.updateUIBasedOnAuth();
        }
    }

    // Get current user profile
    async getCurrentUser() {
        try {
            if (!API.isLoggedIn()) return null;

            const response = await API.request(CONFIG.ENDPOINTS.ME);
            API.setUser(response.user); // Update local storage
            return response;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // Update UI based on authentication state
    updateUIBasedOnAuth() {
        const isLoggedIn = API.isLoggedIn();
        const user = API.getUser();

        // Update login/logout buttons
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userDisplay = document.getElementById('user-display');

        if (loginBtn) {
            loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
        }

        if (logoutBtn) {
            logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
        }

        if (userDisplay && user) {
            userDisplay.textContent = `Welcome, ${user.fullName}`;
            userDisplay.style.display = isLoggedIn ? 'inline-block' : 'none';
        }

        // Show/hide auth-required features
        const authRequired = document.querySelectorAll('.auth-required');
        authRequired.forEach(element => {
            element.style.display = isLoggedIn ? 'block' : 'none';
        });

        const authOptional = document.querySelectorAll('.auth-optional');
        authOptional.forEach(element => {
            if (isLoggedIn) {
                element.classList.add('authenticated');
            } else {
                element.classList.remove('authenticated');
            }
        });
    }

    // Show login prompt
    showLoginPrompt(message = CONFIG.MESSAGES.LOGIN_REQUIRED) {
        if (confirm(`${message}\n\nWould you like to go to the login page?`)) {
            window.location.href = 'login.html';
        }
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!API.isLoggedIn()) {
            this.showLoginPrompt();
            return false;
        }
        return true;
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Global functions for easy access
window.authManager = auth;
window.API = API;
window.CONFIG = CONFIG;

// Auto-update auth UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUIBasedOnAuth();

    // Add logout event listener if logout button exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await auth.logout();
            alert(CONFIG.MESSAGES.LOGOUT_SUCCESS);
            window.location.href = 'index.html';
        });
    }

    // Add login button event listener
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});