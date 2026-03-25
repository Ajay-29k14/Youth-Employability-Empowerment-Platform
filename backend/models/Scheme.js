/**
 * Scheme Model
 * Stores government schemes and skill development programs
 */
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  // Scheme Information
  name: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  // Category
  category: {
    type: String,
    enum: ['Skill Development', 'Employment', 'Education', 'Entrepreneurship', 'Training', 'Other'],
    default: 'Other'
  },
  
  // Eligibility Criteria
  eligibility: {
    ageLimit: {
      min: Number,
      max: Number
    },
    education: [String],
    incomeLimit: String,
    location: [String],
    otherCriteria: String
  },
  
  // Benefits
  benefits: [{
    type: String
  }],
  
  // Application Details
  applicationProcess: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    default: ''
  },
  
  // Important Dates
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  
  // Contact Information
  contactInfo: {
    phone: String,
    email: String,
    website: String,
    officeAddress: String
  },
  
  // Documents Required
  documentsRequired: [{
    type: String
  }],
  
  // Scheme Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Target Audience
  targetAudience: [{
    type: String,
    enum: ['Students', 'Unemployed Youth', 'Women', 'Farmers', 'Entrepreneurs', 'All']
  }],
  
  // Posted By
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
schemeSchema.index({ category: 1 });
schemeSchema.index({ isActive: 1 });
schemeSchema.index({ targetAudience: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
