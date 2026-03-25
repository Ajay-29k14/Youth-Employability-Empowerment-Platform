/**
 * Job Model
 * Stores job opportunities with details for rural youth
 */
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  
  // Job Details
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  
  // Requirements
  requiredSkills: [{
    type: String,
    trim: true
  }],
  educationRequired: {
    type: String,
    enum: ['Any', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate'],
    default: 'Any'
  },
  experienceRequired: {
    type: String,
    default: 'Fresher'
  },
  
  // Location
  location: {
    village: String,
    district: {
      type: String,
      required: [true, 'District is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    }
  },
  
  // Job Type and Salary
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'yearly'],
      default: 'monthly'
    }
  },
  
  // Application Link/Details
  applyLink: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  
  // Job Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Application Deadline
  deadline: {
    type: Date
  },
  
  // Posted By (Admin who added the job)
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for filtering
jobSchema.index({ 'location.district': 1, 'location.state': 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ educationRequired: 1 });
jobSchema.index({ isActive: 1 });

module.exports = mongoose.model('Job', jobSchema);
