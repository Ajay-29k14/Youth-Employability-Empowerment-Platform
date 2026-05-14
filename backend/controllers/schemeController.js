/**
 * Scheme Controller
 * Handles government schemes CRUD operations
 */
const { Scheme, User } = require('../models');
const axios = require("axios");
const puppeteer = require("puppeteer");
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
/**
 * @desc    Fetch government schemes from data.gov.in
 * @route   GET /api/schemes/fetch-government-schemes
 * @access  Public
 */
const fetchGovernmentSchemes = async (req, res) => {
  try {

    const apiKey = process.env.DATA_GOV_API_KEY;

    const resourceId =
      "8b68ae56-84cf-4728-a0a6-1be11028dea7";

    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;

    const response = await axios.get(url);

    const records = response.data.records || [];
    console.log(records[0]);
    let addedCount = 0;

    for (const item of records) {

      // Prevent duplicates
      const existingScheme = await Scheme.findOne({
        name: item.scheme_name
      });

      if (!existingScheme) {

        const newScheme = new Scheme({
          name: item.scheme_name || "Government Scheme",

          description:
            item.description ||
            "Government welfare scheme",

          category:"Other",
            

          targetAudience: ["All"],

          benefits:[
            item.benefits ||
            "Refer official government website",
          ],
          eligibility:{
            otherCriteria:
            item.eligibility ||
            "Refer official guidelines",
          },
          applicationProcess:
            "Visit official website for application process",

          applyLink:
            item.url || "",

          isActive: true
        });

        await newScheme.save();

        addedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `${addedCount} schemes added successfully`,
      totalFetched: records.length
    });

  } catch (error) {

    console.error(
      "Government scheme fetch error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch government schemes",
      error: error.message
    });
  }
};
const cheerio = require("cheerio");
const scrapeMyScheme = async (req, res) => {
  try {

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.goto(
      "https://www.myscheme.gov.in/schemes/pmsby",
      {
        waitUntil: "networkidle2"
      }
    );

    // Wait for content
    await page.waitForSelector("h1");
const schemeData = await page.evaluate(() => {

 
  const titleElement = Array.from(
  document.querySelectorAll("*")
).find(el =>
  el.innerText &&
  el.innerText.trim() ===
    "Pradhan Mantri Suraksha Bima Yojana"
);

const title =
  titleElement?.innerText || "";

  const paragraphs = Array.from(
    document.querySelectorAll("p")
  );

  const description =
  paragraphs
    .map(p => p.innerText.trim())
    .find(text =>
      text.length > 120 &&
      text.length < 350 &&
      !text.includes("Who Can") &&
      !text.includes("Quick Links") &&
      !text.includes("Frequently Asked Questions") &&
      !text.includes("Was this helpful") &&
      !text.includes("Sign In") &&
      !text.includes("Dashboard") &&
      !text.includes("Accessibility")
    ) || "Government welfare scheme";

  return {
    title,
    description
  };
});

    await browser.close();

    const existingScheme = await Scheme.findOne({
  name: schemeData.title
});

if (!existingScheme) {

  const newScheme = new Scheme({

    name: schemeData.title,

    description: schemeData.description,

    category: "Other",

    targetAudience: ["All"],

    benefits: [
      "Visit official website for details"
    ],

    eligibility: {
      otherCriteria:
        "Check official scheme guidelines"
    },

    applicationProcess:
      "Apply through official portal",

    applyLink:
      "https://www.myscheme.gov.in/schemes/pmsby",

    isActive: true
  });

  await newScheme.save();
}

    res.json({
  success: true,
  message: "Scheme saved successfully",
  data: schemeData
});
  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
module.exports = {
  createScheme,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getLatestSchemes,
  fetchGovernmentSchemes,
  scrapeMyScheme
};
