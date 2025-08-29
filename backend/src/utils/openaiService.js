import OpenAI from 'openai';

// Initialize OpenAI client only when API key is available
let openai = null;

const initializeOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export const parseSearchQuery = async (query) => {
  try {
    // Check if OpenAI API key is available
    const client = initializeOpenAI();
    
    if (!client) {
      console.warn('OpenAI API key not found, using fallback parsing');
      return fallbackParsing(query);
    }

    const systemPrompt = `You are a property search assistant for SajiloBasai, a room and flat finder platform in Nepal. 
    Parse natural language queries into structured search parameters. 
    
    Available locations: Lalitpur, Bhaktapur, Kathmandu, Nepalgunj, Birgunj, Kalanki, Boudha, Kirtipur, Chabahil, Swayambhu, Gausala, Hetauda, Dharan, Itahari, Janakpur, Bhairahawa, Butwal, Biratnagar, Pokhara
    
    Property types: room, flat, apartment
    
    Price should be in NPR (Nepalese Rupees). When user says "15k" it means 15,000 NPR.
    
    Return ONLY a JSON object with these fields (use null for missing values):
    {
      "location": "string or null",
      "type": "string or null", 
      "minPrice": number or null,
      "maxPrice": number or null,
      "keywords": ["array", "of", "relevant", "keywords"]
    }
    
    Examples:
    - "rooms under 15k" → {"location": null, "type": "room", "minPrice": null, "maxPrice": 15000, "keywords": ["affordable", "budget"]}
    - "flat in Kathmandu over 20k" → {"location": "Kathmandu", "type": "flat", "minPrice": 20000, "maxPrice": null, "keywords": ["premium"]}
    - "apartment in Lalitpur between 10k to 25k" → {"location": "Lalitpur", "type": "apartment", "minPrice": 10000, "maxPrice": 25000, "keywords": ["mid-range"]}
    - "budget rooms in Bhaktapur" → {"location": "Bhaktapur", "type": "room", "minPrice": null, "maxPrice": 15000, "keywords": ["budget", "affordable"]}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.1,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content.trim();
    
    let parsedQuery;
    try {
      parsedQuery = JSON.parse(response);
    } catch (parseError) {
      console.warn('OpenAI response not valid JSON, using fallback parsing');
      parsedQuery = fallbackParsing(query);
    }

    return parsedQuery;
  } catch (error) {
    console.error('OpenAI parsing error:', error);
    return fallbackParsing(query);
  }
};

const fallbackParsing = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Extract location
  const locations = ['lalitpur', 'bhaktapur', 'kathmandu', 'nepalgunj', 'birgunj', 'kalanki', 'boudha', 'kirtipur', 'chabahil', 'swayambhu', 'gausala', 'hetauda', 'dharan', 'itahari', 'janakpur', 'bhairahawa', 'butwal', 'biratnagar', 'pokhara'];
  const foundLocation = locations.find(loc => lowerQuery.includes(loc));
  
  // Extract property type
  let type = null;
  if (lowerQuery.includes('room')) type = 'room';
  else if (lowerQuery.includes('flat')) type = 'flat';
  else if (lowerQuery.includes('apartment')) type = 'apartment';
  
  // Extract price range
  let minPrice = null;
  let maxPrice = null;
  
  // Pattern for "under X" or "below X"
  const underMatch = lowerQuery.match(/(under|below|less than)\s*(\d+)k?/);
  if (underMatch) {
    const amount = parseInt(underMatch[2]);
    maxPrice = lowerQuery.includes('k') || amount < 100 ? amount * 1000 : amount;
  }
  
  // Pattern for "over X" or "above X"
  const overMatch = lowerQuery.match(/(over|above|more than)\s*(\d+)k?/);
  if (overMatch) {
    const amount = parseInt(overMatch[2]);
    minPrice = lowerQuery.includes('k') || amount < 100 ? amount * 1000 : amount;
  }
  
  // Pattern for "between X and Y" or "X to Y"
  const rangeMatch = lowerQuery.match(/(?:between\s*)?(\d+)k?\s*(?:to|and|-)\s*(\d+)k?/);
  if (rangeMatch) {
    let min = parseInt(rangeMatch[1]);
    let max = parseInt(rangeMatch[2]);
    if (lowerQuery.includes('k') || min < 100) {
      min *= 1000;
      max *= 1000;
    }
    minPrice = min;
    maxPrice = max;
  }
  
  // Budget keywords
  const keywords = [];
  if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('affordable')) {
    keywords.push('budget', 'affordable');
    if (!maxPrice) maxPrice = 15000;
  }
  if (lowerQuery.includes('luxury') || lowerQuery.includes('premium') || lowerQuery.includes('expensive')) {
    keywords.push('premium', 'luxury');
    if (!minPrice) minPrice = 20000;
  }
  
  return {
    location: foundLocation ? foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1) : null,
    type,
    minPrice,
    maxPrice,
    keywords
  };
};