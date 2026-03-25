/**
 * Resource Controller
 * Handles career preparation resources CRUD operations
 */
const { Resource } = require('../models');

/**
 * @desc    Create a new resource (Admin only)
 * @route   POST /api/resources
 * @access  Private (Admin)
 */
const createResource = async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      postedBy: req.user.id
    };
    
    const resource = new Resource(resourceData);
    await resource.save();
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: { resource }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
};

/**
 * @desc    Get all resources with filters
 * @route   GET /api/resources
 * @access  Public
 */
const getResources = async (req, res) => {
  try {
    const {
      category,
      difficultyLevel,
      tags,
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
    
    // Difficulty level filter
    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
    }
    
    // Tags filter
    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagsArray };
    }
    
    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get resources
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Resource.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        resources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message
    });
  }
};

/**
 * @desc    Get resource by ID
 * @route   GET /api/resources/:id
 * @access  Public
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    res.json({
      success: true,
      data: { resource }
    });
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message
    });
  }
};

/**
 * @desc    Update resource (Admin only)
 * @route   PUT /api/resources/:id
 * @access  Private (Admin)
 */
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: { resource }
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message
    });
  }
};

/**
 * @desc    Delete resource (Admin only)
 * @route   DELETE /api/resources/:id
 * @access  Private (Admin)
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
};

/**
 * @desc    Get resources by category
 * @route   GET /api/resources/category/:category
 * @access  Public
 */
const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const resources = await Resource.find({
      category,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: { resources }
    });
  } catch (error) {
    console.error('Get resources by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources by category',
      error: error.message
    });
  }
};

/**
 * @desc    Get popular resources (by view count)
 * @route   GET /api/resources/popular
 * @access  Public
 */
const getPopularResources = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const resources = await Resource.find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: { resources }
    });
  } catch (error) {
    console.error('Get popular resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular resources',
      error: error.message
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCategory,
  getPopularResources
};
