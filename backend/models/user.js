const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Create new user
    static async create({ email, password, fullName }) {
        try {
            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const result = await query(
                `INSERT INTO users (email, password_hash, full_name) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, email, full_name, created_at`,
                [email, passwordHash, fullName]
            );

            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const result = await query(
            'SELECT id, email, password_hash, full_name, created_at FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const result = await query(
            'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update user profile
    static async updateProfile(id, { fullName }) {
        const result = await query(
            `UPDATE users 
             SET full_name = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING id, email, full_name, updated_at`,
            [id, fullName]
        );
        return result.rows[0];
    }

    // Get user stats (quiz count, etc.)
    static async getStats(userId) {
        const result = await query(
            `SELECT 
                COUNT(qr.id) as total_quizzes,
                AVG(CAST(qr.score as FLOAT) / qr.max_score * 100) as avg_score_percentage,
                MAX(qr.submitted_at) as last_quiz_date
             FROM users u
             LEFT JOIN quiz_results qr ON u.id = qr.user_id
             WHERE u.id = $1
             GROUP BY u.id`,
            [userId]
        );
        
        const stats = result.rows[0] || {
            total_quizzes: 0,
            avg_score_percentage: 0,
            last_quiz_date: null
        };

        return {
            totalQuizzes: parseInt(stats.total_quizzes) || 0,
            averageScore: parseFloat(stats.avg_score_percentage) || 0,
            lastQuizDate: stats.last_quiz_date
        };
    }

    // Delete user (for admin purposes)
    static async delete(id) {
        await query('DELETE FROM users WHERE id = $1', [id]);
    }
}

module.exports = User;