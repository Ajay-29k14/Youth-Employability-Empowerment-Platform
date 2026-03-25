/**
 * User Model
 * Stores user information including profile details, skills, and career interests
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Location Information
  location: {
    village: {
      type: String,
      required: [true, 'Village is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    }
  },
  
  // Profile Information
  profile: {
    educationLevel: {
      type: String,
      enum: ['10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other'],
      default: '10th Pass'
    },
    skills: [{
      type: String,
      trim: true
    }],
    careerInterests: [{
      type: String,
      trim: true
    }],
    workExperience: [{
      company: String,
      role: String,
      duration: String,
      description: String
    }],
    languages: [{
      type: String,
      trim: true
    }]
  },
  
  // User Role (user or admin)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['job', 'scheme', 'training', 'general']
    },
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster searching
userSchema.index({ 'location.district': 1, 'location.state': 1 });
userSchema.index({ 'profile.skills': 1 });

module.exports = mongoose.model('User', userSchema);
