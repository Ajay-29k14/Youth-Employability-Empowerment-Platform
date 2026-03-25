/**
 * Job Controller
 * Handles job opportunities CRUD operations and recommendations
 */
const { Job, User } = require('../models');

/**
 * @desc    Create a new job (Admin only)
 * @route   POST /api/jobs
 * @access  Private (Admin)
 */
const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };
    
    const job = new Job(jobData);
    await job.save();
    
    // Notify users in the same location about the new job
    await notifyUsersAboutJob(job);
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

/**
 * @desc    Get all jobs with filters
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = async (req, res) => {
  try {
    const {
      location,
      skills,
      education,
      jobType,
      search,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Location filter
    if (location) {
      filter.$or = [
        { 'location.district': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }
    
    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.requiredSkills = { $in: skillsArray };
    }
    
    // Education filter
    if (education) {
      filter.educationRequired = education;
    }
    
    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }
    
    // Search by title or company
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get jobs
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Job.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

/**
 * @desc    Get job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

/**
 * @desc    Update job (Admin only)
 * @route   PUT /api/jobs/:id
 * @access  Private (Admin)
 */
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

/**
 * @desc    Delete job (Admin only)
 * @route   DELETE /api/jobs/:id
 * @access  Private (Admin)
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

/**
 * @desc    Get recommended jobs for user
 * @route   GET /api/jobs/recommendations
 * @access  Private
 */
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Build recommendation query based on user profile
    const filter = { isActive: true };
    
    // Match by skills
    if (user.profile.skills && user.profile.skills.length > 0) {
      filter.requiredSkills = { $in: user.profile.skills };
    }
    
    // Match by location
    if (user.location) {
      filter.$or = [
        { 'location.district': user.location.district },
        { 'location.state': user.location.state }
      ];
    }
    
    // Match by education
    if (user.profile.educationLevel) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { educationRequired: 'Any' },
        { educationRequired: user.profile.educationLevel }
      );
    }
    
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: { jobs }
    });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended jobs',
      error: error.message
    });
  }
};

/**
 * Helper function to notify users about new jobs
 */
const notifyUsersAboutJob = async (job) => {
  try {
    // Find users in the same location
    const users = await User.find({
      'location.district': job.location.district,
      isActive: true
    });
    
    // Add notification to each user
    for (const user of users) {
      user.notifications.push({
        type: 'job',
        title: `New Job: ${job.title}`,
        message: `${job.companyName} is hiring for ${job.title} in ${job.location.district}`,
        isRead: false
      });
      
      // Keep only last 20 notifications
      if (user.notifications.length > 20) {
        user.notifications = user.notifications.slice(-20);
      }
      
      await user.save();
    }
  } catch (error) {
    console.error('Error notifying users about job:', error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecommendedJobs
};
