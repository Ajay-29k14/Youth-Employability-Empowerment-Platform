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
    console.log("Total schemes found:", total);
console.log("Schemes returned:", schemes.length);
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
      "https://www.myscheme.gov.in/search",
      {
        waitUntil: "networkidle2"
      }
    );

    await new Promise(resolve =>
      setTimeout(resolve, 5000)
    );

 const schemes = await page.evaluate(() => {
  const text = document.body.innerText;

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines;
});
const extractedSchemes = [];

for (let i = 0; i < schemes.length - 2; i++) {

  const current = schemes[i];
  const next = schemes[i + 1];
  const description = schemes[i + 2];

  if (
    next.includes("Ministry") &&
    description.length > 50
  ) {
    extractedSchemes.push({
      name: current,
      ministry: next,
      description
    });
  }
}
let addedCount = 0;

for (const scheme of extractedSchemes) {

  const existingScheme = await Scheme.findOne({
    name: scheme.name
  });

  if (existingScheme) continue;

  await Scheme.create({
    name: scheme.name,

    description: scheme.description,

    category: "Education",

    eligibility: {
      otherCriteria:
        "Check official guidelines"
    },

    benefits: [
      "Government scheme"
    ],

    applicationProcess:
      "Apply through official portal",

    applyLink:
      "https://www.myscheme.gov.in",

    targetAudience: ["All"],

    isActive: true
  });

  addedCount++;
}
console.log("Found schemes:", extractedSchemes.length);
console.log(extractedSchemes);

    await browser.close();
res.json({
  success: true,
  found: extractedSchemes.length,
  addedToDatabase: addedCount
});
    

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
const testApi = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%5D&keyword=scholarship&sort=&from=10&size=10",
      {
        headers: {
  "x-api-key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
  "Origin": "https://www.myscheme.gov.in",
  "Referer": "https://www.myscheme.gov.in/",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
  "Accept": "application/json, text/plain, */*"
}
      }
    );

    console.log(
      "Number of schemes:",
      response.data.data.hits.items.length
    );

    console.log(
      response.data.data.hits.items[0]
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
const importMySchemeData = async (req, res) => {
  try {
    let addedCount = 0;
    let totalFetched = 0;

    for (let from = 0; from < 70; from += 10) {
      console.log("Fetching from =", from);

      const response = await axios.get(
        `https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%5D&keyword=&sort=&from=${from}&size=10`,
        {
          headers: {
            "x-api-key":
              "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
          },
        }
      );

      const schemes = response.data.data.hits.items;

      totalFetched += schemes.length;

      console.log(
        `Page ${from / 10 + 1}: ${schemes.length} schemes`
      );

      for (const item of schemes) {
        const existingScheme = await Scheme.findOne({
          name: item.fields.schemeName,
        });

        if (existingScheme) continue;
        

        const states =
  item.fields.beneficiaryState || [];

const categories =
  item.fields.schemeCategory || [];

const isOdisha =
  states.includes("Odisha");

const isCentral =
  states.includes("All");

const isRelevantState =
  isOdisha || isCentral;

const isRelevantCategory =
  categories.some(cat =>
    cat.includes("Education") ||
    cat.includes("Employment") ||
    cat.includes("Skills") ||
    cat.includes("Entrepreneurship") ||
    cat.includes("Empowerment")
  );

if (!isRelevantState || !isRelevantCategory) {
  continue;
}

        const categoryText =
  categories.join(" ");

let category = "Other";

if (categoryText.includes("Education")) {
  category = "Education";
}
else if (
  categoryText.includes("Skills") ||
  categoryText.includes("Employment")
) {
  category = "Skill Development";
}
else if (
  categoryText.includes("Entrepreneurship")
) {
  category = "Entrepreneurship";
}

        console.log(
          item.fields.schemeName,
          states,
          categories,
          item.fields.level
        );

        await Scheme.create({
          name:
            item.fields.schemeName ||
            "Government Scheme",

          description:
            item.fields.briefDescription ||
            "Refer official website for details",

          category,
          state:
  states.includes("Odisha")
    ? "Odisha"
    : "Central",

          eligibility: {
            otherCriteria:
              item.fields.schemeFor ||
              "Check official guidelines",
          },

          benefits:
            item.fields.tags || [
              "Refer official website",
            ],

          applicationProcess:
            "Apply through official government portal",

          applyLink:
            `https://www.myscheme.gov.in/schemes/${item.slug}`,

          targetAudience: ["All"],

          isActive: true,
        });

        addedCount++;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
    }

    res.json({
      success: true,
      totalFetched,
      addedToDatabase: addedCount,
    });
  } catch (error) {
    console.error(
      error.response?.status,
      error.response?.data
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data || error.message,
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
  scrapeMyScheme,
  testApi,
  importMySchemeData
};
