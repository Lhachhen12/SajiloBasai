// Mock API functions for admin dashboard
import { faker } from '@faker-js/faker';

// Generate dummy booking data
const generateBookings = (count = 10) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    buyerName: faker.person.fullName(),
    sellerName: faker.person.fullName(),
    propertyName: faker.location.streetAddress(),
    date: faker.date.recent({ days: 30 }).toISOString(),
    totalAmount: faker.number.float({ min: 1000, max: 10000, precision: 2 }),
    get commissionAmount() {
      return this.totalAmount * 0.05;
    }
  }));
};

// Generate dummy feedback data
const generateFeedback = (count = 8) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    userName: faker.person.fullName(),
    message: faker.lorem.paragraph(),
    date: faker.date.recent({ days: 60 }).toISOString(),
    status: faker.helpers.arrayElement(['Pending', 'Approved'])
  }));
};

// Generate dummy pages data
const generatePages = (count = 5) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    content: faker.lorem.paragraphs(3),
    type: faker.helpers.arrayElement(['Blog', 'About', 'Terms', 'Privacy']),
    featuredImage: faker.image.url(),
    shortDescription: faker.lorem.paragraph(),
    tags: Array.from({ length: 3 }, () => faker.lorem.word()),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }));
};

// Generate analytics data
const generateAnalytics = () => {
  return {
    dailyVisits: Array.from({ length: 7 }, () => faker.number.int({ min: 100, max: 1000 })),
    weeklyLabels: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse(),
    topCities: Array.from({ length: 5 }, () => ({
      city: faker.location.city(),
      visits: faker.number.int({ min: 1000, max: 5000 })
    })),
    deviceStats: {
      mobile: 45,
      desktop: 40,
      tablet: 15
    },
    topProperties: Array.from({ length: 5 }, () => ({
      title: faker.lorem.words(3),
      views: faker.number.int({ min: 500, max: 2000 })
    }))
  };
};

// Export mock API functions
export const mockApi = {
  getBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateBookings();
  },

  getFeedback: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateFeedback();
  },

  getPages: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generatePages();
  },

  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateAnalytics();
  },

  createPage: async (pageData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: faker.string.uuid(),
      ...pageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updatePage: async (id, pageData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      ...pageData,
      updatedAt: new Date().toISOString()
    };
  },

  deletePage: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, id };
  },

  approveFeedback: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, id, status: 'Approved' };
  }
};

export const getAnalyticsData = async () => {
  return generateAnalytics();
};

export const getDashboardStats = async () => {
  return {
    totalUsers: 150,
    totalListings: 75,
    totalInquiries: 30,
    totalVisits: 500,
    activeSellers: 60
  };
};

export const getListings = async () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 5 }),
    type: faker.helpers.arrayElement(['Apartment', 'House', 'Studio', 'Room', 'Penthouse']),
    price: faker.number.int({ min: 800, max: 5000 }),
    owner: faker.person.fullName(),
    location: faker.location.city(),
    status: faker.helpers.arrayElement(['Active', 'Pending']),
    created: faker.date.recent({ days: 90 }).toLocaleDateString()
  }));
};

export const getUserList = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return Array.from({ length: 15 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['buyer', 'seller']),
    status: faker.helpers.arrayElement(['active', 'inactive', 'blocked']),
    visits: faker.number.int({ min: 10, max: 100 }),
    joinDate: faker.date.past().toLocaleDateString()
  }));
};

export const getReports = async () => {
  return Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    property: faker.lorem.words(3),
    reason: faker.lorem.sentence(),
    reportedBy: faker.person.fullName(),
    date: faker.date.recent().toLocaleDateString(),
    status: faker.helpers.arrayElement(['Pending', 'Resolved'])
  }));
};

export const getAdminProfile = async () => {
  return {
    name: 'Admin User',
    email: 'admin@roomfinder.com',
    phone: '+1234567890',
    role: 'Administrator',
    lastLogin: faker.date.recent().toLocaleString()
  };
};

export const createSeller = async (sellerData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    sellerId: faker.string.uuid(),
    ...sellerData
  };
};

export const createProperty = async (propertyData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    propertyId: faker.string.uuid(),
    ...propertyData
  };
};