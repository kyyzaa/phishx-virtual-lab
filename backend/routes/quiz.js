const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateQuizSubmission } = require('../middleware/validation');
const Quiz = require('../models/quiz');

const router = express.Router();

// Submit quiz answers and get results
router.post('/submit', authenticateToken, validateQuizSubmission, async (req, res) => {
    try {
        const { quizType, answers, startedAt } = req.body;
        const userId = req.userId;

        // Save quiz result and calculate score
        const result = await Quiz.saveResult({
            userId,
            quizType,
            answers,
            startedAt: new Date(startedAt)
        });

        // Calculate percentage
        const percentage = Math.round((result.score / result.max_score) * 100);

        res.json({
            message: 'Quiz submitted successfully',
            result: {
                id: result.id,
                quizType: result.quiz_type,
                score: result.score,
                maxScore: result.max_score,
                percentage,
                submittedAt: result.submitted_at,
                answers: typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers
            }
        });
    } catch (error) {
        console.error('Quiz submission error:', error);
        
        if (error.message.includes('Unknown quiz type')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Get user's quiz history
router.get('/results', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const results = await Quiz.getUserResults(userId, limit, offset);

        res.json({
            results,
            pagination: {
                limit,
                offset,
                count: results.length
            }
        });
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({ error: 'Failed to get quiz results' });
    }
});

// Get specific quiz result details
router.get('/results/:id', authenticateToken, async (req, res) => {
    try {
        const resultId = parseInt(req.params.id);
        const userId = req.userId;

        if (isNaN(resultId)) {
            return res.status(400).json({ error: 'Invalid result ID' });
        }

        const result = await Quiz.getResultById(resultId, userId);

        if (!result) {
            return res.status(404).json({ error: 'Quiz result not found' });
        }

        res.json({ result });
    } catch (error) {
        console.error('Get quiz result error:', error);
        res.status(500).json({ error: 'Failed to get quiz result' });
    }
});

// Get quiz statistics for user
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const quizType = req.query.quizType;

        const stats = await Quiz.getUserQuizStats(userId, quizType);

        res.json({ stats });
    } catch (error) {
        console.error('Get quiz stats error:', error);
        res.status(500).json({ error: 'Failed to get quiz statistics' });
    }
});

// Delete quiz result
router.delete('/results/:id', authenticateToken, async (req, res) => {
    try {
        const resultId = parseInt(req.params.id);
        const userId = req.userId;

        if (isNaN(resultId)) {
            return res.status(400).json({ error: 'Invalid result ID' });
        }

        const deleted = await Quiz.deleteResult(resultId, userId);

        if (!deleted) {
            return res.status(404).json({ error: 'Quiz result not found' });
        }

        res.json({ message: 'Quiz result deleted successfully' });
    } catch (error) {
        console.error('Delete quiz result error:', error);
        res.status(500).json({ error: 'Failed to delete quiz result' });
    }
});

module.exports = router;