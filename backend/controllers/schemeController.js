/**
 * Scheme Controller
 * Handles government schemes CRUD operations
 */
const { Scheme, User } = require('../models');

/**
 * @desc    Create a new scheme (Admin only)
 * @route   POST /api/schemes
 * @access  Private (Admin)
 */
const createScheme = async (req, res) => {
  try {
    const schemeData = {
      ...req.body,
      postedBy: req.user.id
    };
    
    const scheme = new Scheme(schemeData);
    await scheme.save();
    
    // Notify users about new scheme
    await notifyUsersAboutScheme(scheme);
    
    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: { scheme }
    });
  } catch (error) {
    console.error('Create scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating scheme',
      error: error.message
    });
  }
};

/**
 * @desc    Get all schemes with filters
 * @route   GET /api/schemes
 * @access  Public
 */
const getSchemes = async (req, res) => {
  try {
    const {
      category,
      targetAudience,
      search,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Target audience filter
    if (targetAudience) {
      filter.targetAudience = { $in: [targetAudience] };
    }
    
    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get schemes
    const schemes = await Scheme.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Scheme.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        schemes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes',
      error: error.message
    });
  }
};

/**
 * @desc    Get scheme by ID
 * @route   GET /api/schemes/:id
 * @access  Public
 */
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    res.json({
      success: true,
      data: { scheme }
    });
  } catch (error) {
    console.error('Get scheme by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scheme',
      error: error.message
    });
  }
};

/**
 * @desc    Update scheme (Admin only)
 * @route   PUT /api/schemes/:id
 * @access  Private (Admin)
 */
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Scheme updated successfully',
      data: { scheme }
    });
  } catch (error) {
    console.error('Update scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating scheme',
      error: error.message
    });
  }
};

/**
 * @desc    Delete scheme (Admin only)
 * @route   DELETE /api/schemes/:id
 * @access  Private (Admin)
 */
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Delete scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scheme',
      error: error.message
    });
  }
};

/**
 * @desc    Get latest schemes
 * @route   GET /api/schemes/latest
 * @access  Public
 */
const getLatestSchemes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const schemes = await Scheme.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: { schemes }
    });
  } catch (error) {
    console.error('Get latest schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest schemes',
      error: error.message
    });
  }
};

/**
 * Helper function to notify users about new schemes
 */
const notifyUsersAboutScheme = async (scheme) => {
  try {
    // Find all active users
    const users = await User.find({ isActive: true });
    
    // Add notification to each user
    for (const user of users) {
      user.notifications.push({
        type: 'scheme',
        title: `New Scheme: ${scheme.name}`,
        message: `A new ${scheme.category} scheme is available. Check it out!`,
        isRead: false
      });
      
      // Keep only last 20 notifications
      if (user.notifications.length > 20) {
        user.notifications = user.notifications.slice(-20);
      }
      
      await user.save();
    }
  } catch (error) {
    console.error('Error notifying users about scheme:', error);
  }
};

module.exports = {
  createScheme,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getLatestSchemes
};
