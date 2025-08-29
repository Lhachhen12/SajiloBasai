import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';
import User from '../models/user.js';
import { trackPropertyView } from '../middlewares/analytics.js';
import { 
  calculateDistance, 
  filterPropertiesByLocation, 
  calculatePropertyScore,
  geocodeAddress,
  getLocationFromIP
} from '../utils/locationService.js';

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    location,
    type,
    minPrice,
    maxPrice,
    roomType,
    flatType,
    bedrooms,
    bathrooms,
    features,
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
  } = req.query;

  // Build query
  let query = { status: 'available' };

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (type) {
    query.type = type;
  }

  if (roomType) {
    query.roomType = roomType;
  }

  if (flatType) {
    query.flatType = flatType;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  if (bedrooms) {
    query.bedrooms = parseInt(bedrooms);
  }

  if (bathrooms) {
    query.bathrooms = parseInt(bathrooms);
  }

  if (features) {
    const featureArray = features.split(',');
    featureArray.forEach((feature) => {
      query[`features.${feature}`] = true;
    });
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Execute query
  const properties = await Property.find(query)
    .populate('sellerId', 'name email profile.phone')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Property.countDocuments(query);

  res.json({
    success: true,
    count: properties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: properties,
  });
});

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    featured: true,
    status: 'available',
  })
    .populate('sellerId', 'name email profile.phone')
    .sort('-createdAt')
    .limit(8)
    .lean();

  res.json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'sellerId',
    'name email profile.phone profile.avatar'
  );

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Increment view count
  const userAgent = req.get('User-Agent');
  const isLoggedIn = req.user ? true : false;

  property.views.total += 1;
  if (isLoggedIn) {
    property.views.loggedIn += 1;
  } else {
    property.views.anonymous += 1;
  }

  await property.save();

  // Track property view in analytics
  await trackPropertyView(req.params.id, req);

  res.json({
    success: true,
    data: property,
  });
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Seller)
export const createProperty = asyncHandler(async (req, res) => {
  const propertyData = {
    ...req.body,
    sellerId: req.user._id,
  };

  console.log(propertyData);

  const property = await Property.create(propertyData);

  res.status(201).json({
    success: true,
    data: property,
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Seller - own properties only)
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Make sure user is property owner
  if (
    property.sellerId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: property,
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Seller - own properties only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Make sure user is property owner
  if (
    property.sellerId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  await Property.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

// @desc    Get properties by seller
// @route   GET /api/properties/seller/:sellerId
// @access  Public
export const getPropertiesBySeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  let query = { sellerId };
  if (status) {
    query.status = status;
  }

  const properties = await Property.find(query)
    .populate('sellerId', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Property.countDocuments(query);

  res.json({
    success: true,
    count: properties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: properties,
  });
});

// @desc    Get my properties (for sellers)
// @route   GET /api/properties/my-properties
// @access  Private (Seller)
export const getMyProperties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { sellerId: req.user._id };
  if (status) {
    query.status = status;
  }

  const properties = await Property.find(query)
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Property.countDocuments(query);

  res.json({
    success: true,
    count: properties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: properties,
  });
});

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
export const searchProperties = asyncHandler(async (req, res) => {
  const { q, location, type, page = 1, limit = 10 } = req.query;

  let query = { status: 'available' };

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (type) {
    query.type = type;
  }

  const properties = await Property.find(query)
    .populate('sellerId', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Property.countDocuments(query);

  res.json({
    success: true,
    count: properties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: properties,
  });
});

// @desc    Get properties near user location
// @route   POST /api/properties/nearby
// @access  Public
export const getNearbyProperties = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      radius = 25, // default 25km radius
      limit = 12,
      page = 1,
      ...filters 
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Build base query
    let query = { status: 'available' };
    
    // Apply additional filters
    if (filters.type) query.type = filters.type;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    // Get all properties matching basic criteria
    const allProperties = await Property.find(query)
      .populate('sellerId', 'name email phone')
      .lean();

    // Filter by location and calculate distances
    const nearbyProperties = filterPropertiesByLocation(
      allProperties, 
      parseFloat(latitude), 
      parseFloat(longitude), 
      parseFloat(radius)
    );

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProperties = nearbyProperties.slice(skip, skip + parseInt(limit));

    // Calculate relevance scores
    const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const scoredProperties = paginatedProperties.map(property => ({
      ...property,
      relevanceScore: calculatePropertyScore(property, filters, userLocation)
    }));

    // Sort by relevance score
    scoredProperties.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      success: true,
      data: {
        properties: scoredProperties,
        userLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        searchRadius: parseFloat(radius),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(nearbyProperties.length / parseInt(limit)),
          totalProperties: nearbyProperties.length,
          hasNextPage: skip + parseInt(limit) < nearbyProperties.length,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Nearby properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby properties',
      error: error.message
    });
  }
};

// @desc    Get location-based recommendations
// @route   POST /api/properties/recommendations
// @access  Public
export const getLocationBasedRecommendations = async (req, res) => {
  try {
    const {
      userLocation, // { latitude, longitude }
      preferences = {}, // { type, minPrice, maxPrice, features }
      limit = 8
    } = req.body;

    let query = { status: 'available' };
    let allProperties;

    if (userLocation?.latitude && userLocation?.longitude) {
      // Get all available properties
      allProperties = await Property.find(query)
        .populate('sellerId', 'name email phone')
        .lean();

      // Filter by location (50km radius for recommendations)
      const nearbyProperties = filterPropertiesByLocation(
        allProperties,
        userLocation.latitude,
        userLocation.longitude,
        50
      );

      // Calculate recommendation scores
      const recommendations = nearbyProperties.map(property => ({
        ...property,
        recommendationScore: calculatePropertyScore(property, preferences, userLocation)
      }));

      // Sort by recommendation score and limit results
      recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

      res.json({
        success: true,
        data: {
          recommendations: recommendations.slice(0, limit),
          basedOn: 'location_and_preferences',
          userLocation,
          totalFound: recommendations.length
        }
      });

    } else {
      // Fallback to preference-based recommendations without location
      if (preferences.type) query.type = preferences.type;
      if (preferences.minPrice || preferences.maxPrice) {
        query.price = {};
        if (preferences.minPrice) query.price.$gte = preferences.minPrice;
        if (preferences.maxPrice) query.price.$lte = preferences.maxPrice;
      }

      const properties = await Property.find(query)
        .populate('sellerId', 'name email phone')
        .sort({ featured: -1, 'views.total': -1 })
        .limit(limit)
        .lean();

      res.json({
        success: true,
        data: {
          recommendations: properties.map(p => ({ ...p, recommendationScore: 75 })),
          basedOn: 'preferences_only',
          totalFound: properties.length
        }
      });
    }

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

// @desc    Detect user location from IP
// @route   GET /api/properties/detect-location
// @access  Public
export const detectUserLocation = async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // Skip localhost IPs
    if (clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === '::ffff:127.0.0.1') {
      return res.json({
        success: true,
        data: {
          detected: false,
          fallback: true,
          location: {
            city: 'Kathmandu',
            region: 'Bagmati',
            country: 'Nepal',
            coordinates: {
              latitude: 27.7172,
              longitude: 85.3240
            }
          },
          message: 'Using default location (localhost detected)'
        }
      });
    }

    const locationResult = await getLocationFromIP(clientIP);

    if (locationResult.success) {
      res.json({
        success: true,
        data: {
          detected: true,
          location: {
            city: locationResult.city,
            region: locationResult.region,
            country: locationResult.country,
            coordinates: locationResult.coordinates
          },
          ip: clientIP
        }
      });
    } else {
      // Fallback to Kathmandu
      res.json({
        success: true,
        data: {
          detected: false,
          fallback: true,
          location: {
            city: 'Kathmandu',
            region: 'Bagmati',
            country: 'Nepal',
            coordinates: {
              latitude: 27.7172,
              longitude: 85.3240
            }
          },
          message: 'IP detection failed, using default location'
        }
      });
    }

  } catch (error) {
    console.error('Location detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect location',
      error: error.message
    });
  }
};

// @desc    Geocode an address
// @route   POST /api/properties/geocode
// @access  Private (Admin/Seller)
export const geocodePropertyAddress = async (req, res) => {
  try {
    const { address, city } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const geocodeResult = await geocodeAddress(address, city);

    if (geocodeResult.success) {
      res.json({
        success: true,
        data: {
          coordinates: geocodeResult.coordinates,
          formattedAddress: geocodeResult.formattedAddress
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: geocodeResult.message
      });
    }

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      message: 'Geocoding failed',
      error: error.message
    });
  }
};

// Update your existing createProperty function to include geocoding
export const createPropertyWithLocation = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      sellerId: req.user._id,
    };

    // Auto-geocode if coordinates not provided
    if (!propertyData.coordinates?.latitude || !propertyData.coordinates?.longitude) {
      const address = `${propertyData.location}, ${propertyData.address?.city || ''}, Nepal`;
      const geocodeResult = await geocodeAddress(address);
      
      if (geocodeResult.success) {
        propertyData.coordinates = {
          ...geocodeResult.coordinates,
          lastUpdated: new Date()
        };
      }
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: property,
      geocoded: !!propertyData.coordinates?.latitude
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

// @desc    Toggle property featured status
// @route   PUT /api/properties/:id/featured
// @access  Private (Admin)
export const toggleFeatured = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  property.featured = !property.featured;
  await property.save();

  res.json({
    success: true,
    data: property,
  });
});

// Add these imports to the top of your existing propertyController.js
import { parseSearchQuery } from '../utils/openaiService.js';

//function to your existing propertyController.js
export const superSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Parse the natural language query using OpenAI (or fallback)
    const parsedQuery = await parseSearchQuery(query);
    console.log('Parsed query:', parsedQuery);

    // Build database query with CORRECT field name
    let searchFilters = { 
      status: "available"  // Use status instead of isAvailable
    };
    
    // Location filter - search across multiple fields
    if (parsedQuery.location) {
      const locationRegex = new RegExp(parsedQuery.location, 'i');
      searchFilters.$or = [
        { location: locationRegex },
        { 'address.city': locationRegex },
        { 'address.state': locationRegex },
        { title: locationRegex },
        { description: locationRegex }
      ];
    }

    // Property type filter
    if (parsedQuery.type) {
      const typeRegex = new RegExp(parsedQuery.type, 'i');
      if (!searchFilters.$or) {
        searchFilters.type = typeRegex;
      } else {
        // Combine with location filters
        const locationOr = searchFilters.$or;
        searchFilters.$and = [
          { $or: locationOr },
          { type: typeRegex }
        ];
        delete searchFilters.$or;
      }
    }

    // Price range filter
    if (parsedQuery.minPrice || parsedQuery.maxPrice) {
      searchFilters.price = {};
      if (parsedQuery.minPrice) {
        searchFilters.price.$gte = parsedQuery.minPrice;
      }
      if (parsedQuery.maxPrice) {
        searchFilters.price.$lte = parsedQuery.maxPrice;
      }
    }

    console.log('Database filters:', JSON.stringify(searchFilters, null, 2));

    // Execute the search
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let properties = await Property.find(searchFilters)
      .populate('sellerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    let total = await Property.countDocuments(searchFilters);

    console.log(`Found ${properties.length} properties with strict filters`);

    // If no results, try broader search
    if (properties.length === 0) {
      console.log('No results with strict filters, trying broader text search...');
      
      const broadSearchFilters = { status: "available" };
      
      // Create search terms from the original query
      const queryWords = query.toLowerCase()
        .split(' ')
        .filter(word => word.length > 2)
        .map(word => word.replace(/[^a-zA-Z0-9]/g, '')); // Remove special chars
      
      if (queryWords.length > 0) {
        const searchRegex = new RegExp(queryWords.join('|'), 'i');
        broadSearchFilters.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { type: searchRegex }
        ];

        // Apply price filters if they exist
        if (parsedQuery.minPrice || parsedQuery.maxPrice) {
          broadSearchFilters.price = {};
          if (parsedQuery.minPrice) broadSearchFilters.price.$gte = parsedQuery.minPrice;
          if (parsedQuery.maxPrice) broadSearchFilters.price.$lte = parsedQuery.maxPrice;
        }

        console.log('Broader search filters:', JSON.stringify(broadSearchFilters, null, 2));

        properties = await Property.find(broadSearchFilters)
          .populate('sellerId', 'name email phone')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        total = await Property.countDocuments(broadSearchFilters);
        console.log(`Found ${properties.length} properties with broader search`);
      }
    }

    // Add relevance scoring
    const scoredProperties = properties.map(property => {
      let relevanceScore = 10;
      
      const queryLower = query.toLowerCase();
      const titleLower = (property.title || '').toLowerCase();
      const descriptionLower = (property.description || '').toLowerCase();
      const locationLower = (property.location || '').toLowerCase();
      
      // Score based on matches
      if (titleLower.includes(queryLower)) relevanceScore += 50;
      if (locationLower.includes(queryLower)) relevanceScore += 40;
      if (descriptionLower.includes(queryLower)) relevanceScore += 30;
      
      // Individual word matches
      query.toLowerCase().split(' ').forEach(word => {
        if (word.length > 2) {
          if (titleLower.includes(word)) relevanceScore += 10;
          if (locationLower.includes(word)) relevanceScore += 8;
          if (descriptionLower.includes(word)) relevanceScore += 5;
        }
      });

      // Boost featured properties
      if (property.featured) relevanceScore += 5;

      return {
        ...property,
        relevanceScore: Math.round(relevanceScore)
      };
    });

    // Sort by relevance
    scoredProperties.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json({
      success: true,
      data: {
        properties: scoredProperties,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProperties: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        searchParams: {
          originalQuery: query,
          parsedQuery: parsedQuery,
          filtersApplied: searchFilters
        }
      }
    });

  } catch (error) {
    console.error('Super search error:', error);
    res.status(500).json({
      success: false,
      message: 'Super search failed',
      error: error.message
    });
  }
};