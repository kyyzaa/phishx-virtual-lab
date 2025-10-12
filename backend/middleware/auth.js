const { verifyToken } = require('../config/jwt');
const { query } = require('../config/database');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                error: 'Access token required',
                code: 'NO_TOKEN' 
            });
        }

        // Verify JWT token
        const decoded = verifyToken(token);
        
        // Check if user still exists in database
        const userResult = await query(
            'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                error: 'User not found',
                code: 'USER_NOT_FOUND' 
            });
        }

        // Attach user info to request
        req.user = userResult.rows[0];
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        
        if (error.message.includes('expired')) {
            return res.status(401).json({ 
                error: 'Token expired',
                code: 'TOKEN_EXPIRED' 
            });
        }
        
        return res.status(401).json({ 
            error: 'Invalid token',
            code: 'INVALID_TOKEN' 
        });
    }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            const userResult = await query(
                'SELECT id, email, full_name FROM users WHERE id = $1',
                [decoded.userId]
            );

            if (userResult.rows.length > 0) {
                req.user = userResult.rows[0];
                req.userId = decoded.userId;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication for optional auth
        next();
    }
};

module.exports = {
    authenticateToken,
    optionalAuth
};