/**
 * Resource Model
 * Stores career preparation resources like interview tips, resume guides, etc.
 */
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  // Resource Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  // Category
  category: {
    type: String,
    enum: ['Interview Tips', 'Resume Tips', 'Practice Questions', 'Career Guidance', 'Skill Building', 'Other'],
    required: true
  },
  
  // Content
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  
  // Additional Resources (links, PDFs, etc.)
  attachments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'image']
    }
  }],
  
  // Tags for searching
  tags: [{
    type: String,
    trim: true
  }],
  
  // Difficulty Level
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  // Read Time (in minutes)
  readTime: {
    type: Number,
    default: 5
  },
  
  // Resource Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // View Count
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Posted By
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ difficultyLevel: 1 });
resourceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
