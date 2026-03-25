/**
 * Auth Controller
 * Handles user registration, login, and profile management
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, location } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      location
    });
    
    // Save user to database
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          location: user.location,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          location: user.location,
          profile: user.profile,
          role: user.role,
          notifications: user.notifications.slice(-5) // Last 5 notifications
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const {
      educationLevel,
      skills,
      careerInterests,
      workExperience,
      languages
    } = req.body;
    
    // Find user and update profile
    const user = await User.findById(req.user.id);
    
    if (educationLevel) user.profile.educationLevel = educationLevel;
    if (skills) user.profile.skills = skills;
    if (careerInterests) user.profile.careerInterests = careerInterests;
    if (workExperience) user.profile.workExperience = workExperience;
    if (languages) user.profile.languages = languages;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @desc    Add skill to user profile
 * @route   POST /api/auth/skills
 * @access  Private
 */
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    
    if (!skill || skill.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Skill is required'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if skill already exists
    if (user.profile.skills.includes(skill.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }
    
    user.profile.skills.push(skill.trim());
    await user.save();
    
    res.json({
      success: true,
      message: 'Skill added successfully',
      data: { skills: user.profile.skills }
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding skill',
      error: error.message
    });
  }
};

/**
 * @desc    Remove skill from user profile
 * @route   DELETE /api/auth/skills/:skill
 * @access  Private
 */
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;
    
    const user = await User.findById(req.user.id);
    user.profile.skills = user.profile.skills.filter(s => s !== skill);
    await user.save();
    
    res.json({
      success: true,
      message: 'Skill removed successfully',
      data: { skills: user.profile.skills }
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing skill',
      error: error.message
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/auth/notifications/:notificationId
 * @access  Private
 */
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user.id);
    const notification = user.notifications.id(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    notification.isRead = true;
    await user.save();
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification',
      error: error.message
    });
  }
};

/**
 * @desc    Get all notifications
 * @route   GET /api/auth/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    
    res.json({
      success: true,
      data: { notifications: user.notifications }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  markNotificationRead,
  getNotifications
};
