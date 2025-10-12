const { query } = require('../config/database');

class Quiz {
    // Save quiz result
    static async saveResult({ userId, quizType, answers, startedAt }) {
        try {
            // Calculate score based on answers
            const { score, maxScore } = this.calculateScore(quizType, answers);

            const result = await query(
                `INSERT INTO quiz_results (user_id, quiz_type, score, max_score, answers, started_at, submitted_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) 
                 RETURNING *`,
                [userId, quizType, score, maxScore, JSON.stringify(answers), startedAt]
            );

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get user's quiz results
    static async getUserResults(userId, limit = 10, offset = 0) {
        const result = await query(
            `SELECT id, quiz_type, score, max_score, 
                    ROUND(CAST(score as DECIMAL) / max_score * 100, 1) as percentage,
                    started_at, submitted_at
             FROM quiz_results 
             WHERE user_id = $1 
             ORDER BY submitted_at DESC 
             LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        return result.rows;
    }

    // Get specific quiz result with answers
    static async getResultById(resultId, userId) {
        const result = await query(
            `SELECT qr.*, u.full_name, u.email
             FROM quiz_results qr
             JOIN users u ON qr.user_id = u.id
             WHERE qr.id = $1 AND qr.user_id = $2`,
            [resultId, userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            ...row,
            answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
            percentage: Math.round((row.score / row.max_score) * 100)
        };
    }

    // Calculate score based on quiz type and answers
    static calculateScore(quizType, answers) {
        // Define correct answers for different quiz types
        const quizData = this.getQuizData(quizType);
        
        if (!quizData) {
            throw new Error(`Unknown quiz type: ${quizType}`);
        }

        let score = 0;
        const maxScore = quizData.questions.length;

        answers.forEach(answer => {
            const question = quizData.questions.find(q => q.id === answer.questionId);
            if (question && question.correctAnswer === answer.selectedChoice) {
                score++;
            }
        });

        return { score, maxScore };
    }

    // Get quiz questions and correct answers (this should match your frontend quiz data)
    static getQuizData(quizType) {
        const quizzes = {
            'phishing-basic': {
                questions: [
                    {
                        id: 'q1',
                        correctAnswer: 'a' // Example: option A is correct
                    },
                    {
                        id: 'q2', 
                        correctAnswer: 'b' // Example: option B is correct
                    },
                    {
                        id: 'q3',
                        correctAnswer: 'c' // Example: option C is correct
                    },
                    {
                        id: 'q4',
                        correctAnswer: 'a'
                    },
                    {
                        id: 'q5',
                        correctAnswer: 'b'
                    }
                ]
            },
            'phishing-advanced': {
                questions: [
                    { id: 'adv1', correctAnswer: 'a' },
                    { id: 'adv2', correctAnswer: 'c' },
                    { id: 'adv3', correctAnswer: 'b' },
                    { id: 'adv4', correctAnswer: 'a' },
                    { id: 'adv5', correctAnswer: 'c' }
                ]
            }
        };

        return quizzes[quizType];
    }

    // Get quiz statistics for a user
    static async getUserQuizStats(userId, quizType = null) {
        let whereClause = 'WHERE user_id = $1';
        let params = [userId];
        
        if (quizType) {
            whereClause += ' AND quiz_type = $2';
            params.push(quizType);
        }

        const result = await query(
            `SELECT 
                quiz_type,
                COUNT(*) as attempt_count,
                MAX(score) as best_score,
                MAX(max_score) as max_possible_score,
                AVG(CAST(score as FLOAT) / max_score * 100) as avg_percentage,
                MAX(submitted_at) as last_attempt
             FROM quiz_results 
             ${whereClause}
             GROUP BY quiz_type
             ORDER BY last_attempt DESC`,
            params
        );

        return result.rows;
    }

    // Delete quiz result
    static async deleteResult(resultId, userId) {
        const result = await query(
            'DELETE FROM quiz_results WHERE id = $1 AND user_id = $2 RETURNING id',
            [resultId, userId]
        );
        return result.rows.length > 0;
    }
}

module.exports = Quiz;