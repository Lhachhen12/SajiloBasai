import axios from 'axios';

// Haversine Algorithm - Calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Convert kilometers to miles
export const kmToMiles = (km) => km * 0.621371;

// Geocoding - Convert address to coordinates using Nominatim (free)
export const geocodeAddress = async (address, city = '', country = 'Nepal') => {
  try {
    const query = `${address}, ${city}, ${country}`.replace(/,\s*,/g, ',').trim();
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1,
        countrycodes: 'np', // Restrict to Nepal
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'SajiloBasai-PropertyFinder/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        success: true,
        coordinates: {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          accuracy: result.importance || 0.5
        },
        formattedAddress: result.display_name
      };
    }
    
    return { success: false, message: 'Location not found' };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { success: false, message: 'Geocoding service unavailable' };
  }
};

// Reverse Geocoding - Convert coordinates to address
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 18,
        addressdetails: 1
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'SajiloBasai-PropertyFinder/1.0'
      }
    });

    if (response.data) {
      const address = response.data.address || {};
      return {
        success: true,
        address: {
          street: address.road || address.pedestrian || '',
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          country: address.country || 'Nepal',
          postcode: address.postcode || ''
        },
        formattedAddress: response.data.display_name
      };
    }
    
    return { success: false, message: 'Address not found' };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { success: false, message: 'Reverse geocoding service unavailable' };
  }
};

// IP-based location detection (fallback)
export const getLocationFromIP = async (ip) => {
  try {
    // Using free IP geolocation service
    const response = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 5000
    });

    if (response.data && response.data.status === 'success') {
      return {
        success: true,
        coordinates: {
          latitude: response.data.lat,
          longitude: response.data.lon,
          accuracy: 0.3 // IP location is less accurate
        },
        city: response.data.city,
        region: response.data.regionName,
        country: response.data.country
      };
    }
    
    return { success: false, message: 'IP location not found' };
  } catch (error) {
    console.error('IP geolocation error:', error);
    return { success: false, message: 'IP geolocation service unavailable' };
  }
};

// Location-based property filtering algorithm
export const filterPropertiesByLocation = (properties, userLat, userLon, maxDistance = 50) => {
  return properties
    .map(property => {
      let distance = null;
      
      // Calculate distance if property has coordinates
      if (property.coordinates?.latitude && property.coordinates?.longitude) {
        distance = calculateDistance(
          userLat, 
          userLon, 
          property.coordinates.latitude, 
          property.coordinates.longitude
        );
      }
      
      return {
        ...property,
        distance: distance,
        distanceInMiles: distance ? kmToMiles(distance) : null
      };
    })
    .filter(property => {
      // Include properties within maxDistance or without coordinates (manual review)
      return !property.distance || property.distance <= maxDistance;
    })
    .sort((a, b) => {
      // Sort by distance (closest first), then by relevance
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      if (a.distance && !b.distance) return -1;
      if (!a.distance && b.distance) return 1;
      return 0;
    });
};

// Multi-factor recommendation algorithm
export const calculatePropertyScore = (property, userPreferences, userLocation) => {
  let score = 0;
  
  // Distance factor (40% weight)
  if (userLocation && property.coordinates?.latitude && property.coordinates?.longitude) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      property.coordinates.latitude,
      property.coordinates.longitude
    );
    
    // Closer properties get higher scores (inverse relationship)
    const distanceScore = Math.max(0, 100 - (distance * 2)); // 2 points deducted per km
    score += distanceScore * 0.4;
  }
  
  // Price preference factor (30% weight)
  if (userPreferences.minPrice || userPreferences.maxPrice) {
    const minPrice = userPreferences.minPrice || 0;
    const maxPrice = userPreferences.maxPrice || Infinity;
    
    if (property.price >= minPrice && property.price <= maxPrice) {
      score += 30; // Perfect price match
    } else {
      // Partial score based on how close the price is
      const midRange = (minPrice + maxPrice) / 2;
      const priceDiff = Math.abs(property.price - midRange);
      const maxDiff = Math.max(midRange - minPrice, maxPrice - midRange);
      const priceScore = Math.max(0, 30 - (priceDiff / maxDiff) * 30);
      score += priceScore * 0.3;
    }
  }
  
  // Property type preference factor (20% weight)
  if (userPreferences.type && property.type === userPreferences.type) {
    score += 20;
  }
  
  // Property popularity factor (10% weight)
  const viewsScore = Math.min(10, (property.views?.total || 0) / 100);
  score += viewsScore;
  
  // Featured property bonus
  if (property.featured) {
    score += 5;
  }
  
  return Math.round(score);
};

// Area-based clustering algorithm for properties without coordinates
export const groupPropertiesByArea = (properties) => {
  const areas = {};
  
  properties.forEach(property => {
    const area = property.location.toLowerCase();
    
    if (!areas[area]) {
      areas[area] = {
        name: property.location,
        properties: [],
        averagePrice: 0,
        count: 0
      };
    }
    
    areas[area].properties.push(property);
    areas[area].count++;
  });
  
  // Calculate average price for each area
  Object.keys(areas).forEach(area => {
    const totalPrice = areas[area].properties.reduce((sum, prop) => sum + prop.price, 0);
    areas[area].averagePrice = Math.round(totalPrice / areas[area].count);
  });
  
  return areas;
};

// Bulk geocoding for existing properties
export const bulkGeocodeProperties = async (properties, delay = 1000) => {
  const results = [];
  
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    
    // Skip if already has coordinates
    if (property.coordinates?.latitude && property.coordinates?.longitude) {
      results.push({ property, geocoded: false, reason: 'Already has coordinates' });
      continue;
    }
    
    const address = `${property.location}, ${property.address?.city || ''}, Nepal`;
    const geocodeResult = await geocodeAddress(address);
    
    if (geocodeResult.success) {
      results.push({
        property,
        geocoded: true,
        coordinates: geocodeResult.coordinates,
        formattedAddress: geocodeResult.formattedAddress
      });
    } else {
      results.push({
        property,
        geocoded: false,
        reason: geocodeResult.message
      });
    }
    
    // Add delay to respect API rate limits
    if (i < properties.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};