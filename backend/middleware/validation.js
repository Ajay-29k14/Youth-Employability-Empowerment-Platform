/**
 * Validation Middleware
 * Validates user input using express-validator
 */
const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  
  body('location.village')
    .trim()
    .notEmpty()
    .withMessage('Village is required'),
  
  body('location.district')
    .trim()
    .notEmpty()
    .withMessage('District is required'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  handleValidationErrors
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Job creation validation rules
 */
const jobValidation = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),
  
  body('location.district')
    .trim()
    .notEmpty()
    .withMessage('District is required'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  handleValidationErrors
];

/**
 * Scheme creation validation rules
 */
const schemeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Scheme name is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  
  body('applicationProcess')
    .trim()
    .notEmpty()
    .withMessage('Application process is required'),
  
  handleValidationErrors
];

/**
 * Resource creation validation rules
 */
const resourceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  handleValidationErrors
];

/**
 * Profile update validation rules
 */
const profileValidation = [
  body('educationLevel')
    .optional()
    .isIn(['10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other'])
    .withMessage('Invalid education level'),
  
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  jobValidation,
  schemeValidation,
  resourceValidation,
  profileValidation,
  handleValidationErrors
};
