import fetch from 'node-fetch';

const testQueries = [
  'room in kathmandu',
  'rooms under 15k',
  'apartment in lalitpur',
  'tindu room', // This should match your existing property
  'jorpati room', // This should also match
  'cheap room'
];

const testSuperSearch = async (query) => {
  console.log(`\n🔍 Testing: "${query}"`);
  console.log('-'.repeat(50));
  
  try {
    const response = await fetch('http://localhost:5000/api/properties/super-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      const errorText = await response.text();
      console.log(errorText);
      return;
    }

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Found ${data.data.properties.length} properties`);
      console.log(`📊 Parsed query:`, data.data.searchParams.parsedQuery);
      
      if (data.data.properties.length > 0) {
        console.log('\n📋 Results:');
        data.data.properties.forEach((property, index) => {
          console.log(`  ${index + 1}. ${property.title} - NPR ${property.price}`);
          console.log(`     📍 ${property.location}`);
          console.log(`     🏠 ${property.type}`);
          console.log(`     ⭐ Relevance: ${property.relevanceScore}`);
        });
      }
    } else {
      console.log(`❌ Search failed: ${data.message}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
};

const runTests = async () => {
  console.log('🚀 Starting Super Search Tests...');
  
  for (const query of testQueries) {
    await testSuperSearch(query);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n✨ Tests completed!');
};

runTests().catch(console.error);