import { PAGE_STATUS } from './constants';

// Mock API functions - replace with actual API calls
let mockPages = [
  {
    id: 1,
    title: 'About Us',
    type: 'about',
    content: '<h1>Welcome to RoomFinder</h1><p>We help you find the perfect place to stay.</p>',
    lastUpdated: '2024-02-20',
    status: PAGE_STATUS.PUBLISHED,
    featuredImage: null
  },
  {
    id: 2,
    title: 'Terms & Conditions',
    type: 'terms',
    content: '<h1>Terms & Conditions</h1><p>By using our service you agree to these terms.</p>',
    lastUpdated: '2024-02-19',
    status: PAGE_STATUS.PUBLISHED,
    featuredImage: null
  },
  {
    id: 3,
    title: 'Privacy Policy',
    type: 'privacy',
    content: '<h1>Privacy Policy</h1><p>Your privacy matters to us.</p>',
    lastUpdated: '2024-02-18',
    status: PAGE_STATUS.DRAFT,
    featuredImage: null
  }
];

export const getPages = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockPages];
};

export const getPageById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPages.find(page => page.id === id);
};

export const savePage = async (pageData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (pageData.id) {
    // Update existing page
    mockPages = mockPages.map(page => 
      page.id === pageData.id ? { 
        ...pageData, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      } : page
    );
    return pageData;
  } else {
    // Create new page
    const newPage = {
      ...pageData,
      id: Math.max(...mockPages.map(p => p.id)) + 1,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    mockPages.push(newPage);
    return newPage;
  }
};

export const deletePage = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockPages = mockPages.filter(page => page.id !== id);
  return true;
};