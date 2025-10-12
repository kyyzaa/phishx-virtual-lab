const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// User registration validation
const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('fullName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Full name must be at least 2 characters long'),
    handleValidationErrors
];

// User login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Quiz submission validation
const validateQuizSubmission = [
    body('quizType')
        .isString()
        .isLength({ min: 1 })
        .withMessage('Quiz type is required'),
    body('answers')
        .isArray()
        .withMessage('Answers must be an array'),
    body('answers.*.questionId')
        .isString()
        .withMessage('Each answer must have a valid question ID'),
    body('answers.*.selectedChoice')
        .isString()
        .withMessage('Each answer must have a selected choice'),
    body('startedAt')
        .isISO8601()
        .withMessage('Started time must be a valid ISO date'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateQuizSubmission,
    handleValidationErrors
};