// CMS API Integration
import { API_URL } from '../config.js';

// API Helper Functions
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleApiResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Mock CMS data and functions for SajiloBasai

const CMS_PAGES = {
  about: {
    title: 'About SajiloBasai',
    content: `
# 🏠 About SajiloBasai

Welcome to SajiloBasai, Nepal's premier platform for finding rooms, flats, and apartments. We're dedicated to making your property search simple, efficient, and stress-free and the best part? It’s completely free for everyone.

## 🎯 Our Mission

At SajiloBasai, our mission is to revolutionize the way people find rental properties in Nepal. We aim to create a transparent, accessible, and reliable platform that bridges the gap between property seekers and owners without any agents or service fees.

## Why Choose SajiloBasai?

- **🏘️ Comprehensive Listings**: Thousands of verified rooms, flats, and apartments across Nepal
- **📍 Local Expertise**: Focused entirely on the Nepali rental market and user needs
- **🔗 Direct Communication**: Contact landlords directly — no middlemen involved
- **✅ Trusted Platform**: Listings are verified and reviewed to maintain quality and trust
- **🕒 24/7 Support**: Our dedicated customer support is always ready to assist
- **💸 100% Free**: No commission, no subscription — completely free to use
- **🚀 Fast & Simple**: Built with a modern, user-friendly interface for quick search and filtering
- **🛠 Built by Students, For the People**: Developed as a college project with real social impact

## Our Story

Founded in 2023 in Kathmandu, SajiloBasai was born out of the frustration of finding quality rental properties. Our team of real estate experts and tech enthusiasts work tirelessly to provide the best rental experience in Nepal.
    `,
    team: [
      {
        name: 'Aasish Tamang',
        position: 'Founder & CEO',
        bio: 'Real estate expert with 10+ years experience in Kathmandu market',
        image: '/aka1.jpg',
      },
      {
        name: 'Lhachhen Wanjyu Lama',
        position: 'Head of Operations',
        bio: 'Specializes in tenant-landlord relations and property management',
        image: '/sijan.jpg',
      },
      {
        name: 'Aka Dorje Sherpa',
        position: 'Product Manager',
        bio: 'Oversees platform development and user experience',
        image: '/sajilo.png',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
# Privacy Policy

Last updated: June 2024

## Introduction

SajiloBasai ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.

## Information We Collect

We collect information to provide better services to our users:

- **Personal Information**: Name, contact details, identification documents
- **Property Preferences**: Budget, location, amenities
- **Usage Data**: How you interact with our platform
- **Communication Records**: Messages between tenants and landlords

## How We Use Your Information

- To match you with suitable properties
- To verify user identities and prevent fraud
- To improve our services and platform
- To communicate important updates
- To comply with legal requirements in Nepal

## Data Security

We implement industry-standard security measures to protect your data, including encryption and secure servers.

## Your Rights

As a user in Nepal, you have the right to:

- Access your personal data
- Request correction of inaccurate information
- Delete your account and associated data
- Opt-out of marketing communications
    `,
  },
  terms: {
    title: 'Terms & Conditions',
    content: `
# Terms and Conditions

Last updated: June 2024

## 1. Acceptance of Terms

By using SajiloBasai, you agree to these Terms and Conditions and our Privacy Policy.

## 2. User Accounts

- Must be 18 years or older to create an account
- Must provide accurate and current information
- Are responsible for maintaining account security
- Must not share login credentials

## 3. Property Listings

- All listings must be accurate and truthful
- Must have legal right to list the property
- Must not discriminate based on caste, ethnicity, or religion
- SajiloBasai reserves the right to remove inappropriate listings

## 4. Fees and Payments

- Property owners: 5% commission on successful rentals
- Tenants: No fees for using basic services
- Premium services available with additional fees
- All payments processed in Nepalese Rupees (NPR)

## 5. Prohibited Activities

Users may not:

- Post false or misleading information
- Harass other users
- Circumvent our payment system
- Use automated tools to scrape data
- Violate any Nepali laws
    `,
  },
  blog: {
    posts: [
      {
        id: 1,
        title: 'How to Find Affordable Rooms in Kathmandu',
        slug: 'affordable-rooms-kathmandu',
        excerpt:
          'Practical tips for students and young professionals looking for budget-friendly accommodation in Kathmandu.',
        content: `
# How to Find Affordable Rooms in Kathmandu

Finding affordable accommodation in Kathmandu can be challenging, especially for students and young professionals. Here are some proven strategies to help you secure a good place within your budget.

## 1. Know Your Budget

Before you start looking:
- Calculate your monthly income/allowance
- Determine how much you can realistically spend on rent (typically 30-40% of income)
- Remember additional costs: utilities, internet, transportation

## 2. Explore Different Areas

Consider these budget-friendly neighborhoods:
- **Kirtipur**: Affordable with good university access
- **Baneshwor**: Central location with reasonable prices
- **Kalanki**: Good transportation links
- **Swayambhu**: Popular with students

## 3. Use Multiple Search Methods

- **Online platforms** like SajiloBasai
- **Local newspapers** (Himalayan Times, Kathmandu Post classifieds)
- **Notice boards** at universities and colleges
- **Word of mouth** - tell friends and colleagues you're looking

## 4. Consider Shared Accommodation

Options include:
- Sharing a flat with roommates
- Paying guest arrangements
- Hostel facilities
- Subletting during vacation periods

## 5. Negotiate Smartly

When you find a place:
- Offer to sign a longer lease for better rates
- Ask about included utilities
- Politely negotiate the security deposit
- Offer references from previous landlords

## 6. Be Prepared to Move Quickly

Good deals go fast in Kathmandu:
- Have your documents ready (citizenship, references)
- Carry deposit money when viewing
- Be ready to make quick decisions

By following these tips and using SajiloBasai's platform, you can find comfortable accommodation that fits your budget.
        `,
        author: 'Anita Shrestha',
        date: '2024-05-15',
        category: 'Renting Tips',
        tags: ['kathmandu', 'budget', 'students'],
        featuredImage: '/room1.jpg',
      },
      {
        id: 2,
        title: 'Essential Checklist Before Renting a Flat in Nepal',
        slug: 'rental-checklist-nepal',
        excerpt:
          'A comprehensive guide to inspecting properties and understanding rental agreements in Nepal.',
        content: `
# Essential Checklist Before Renting a Flat in Nepal

Renting a flat in Nepal requires careful consideration. This checklist will help you avoid common pitfalls and ensure you make the right choice.

## Before Viewing the Property

1. **Research the Neighborhood**
   - Safety and security
   - Proximity to work/school
   - Availability of public transport
   - Nearby amenities (markets, hospitals)

2. **Verify the Owner/Landlord**
   - Ask for identification
   - Confirm ownership documents
   - Check reviews if available online

## During Property Inspection

1. **Structural Check**
   - Look for cracks in walls/ceilings
   - Check for water leakage marks
   - Test doors and windows

2. **Plumbing and Electricity**
   - Test all taps and showers
   - Check water pressure
   - Test all switches and sockets
   - Ask about load shedding solutions

3. **Amenities Verification**
   - Confirm what's included (furniture, appliances)
   - Check condition of provided items
   - Test internet connectivity if important

## Rental Agreement Essentials

1. **Key Terms to Verify**
   - Monthly rent amount
   - Security deposit (usually 1-3 months rent)
   - Maintenance responsibilities
   - Notice period for termination

2. **Special Conditions**
   - Guest policy
   - Pet policy if applicable
   - Modification rules (painting, nails)

3. **Payment Details**
   - Due date for rent
   - Accepted payment methods
   - Receipt requirements

## Before Moving In

1. **Document the Condition**
   - Take photos/videos of entire flat
   - Note any existing damages
   - Have landlord sign an inventory list

2. **Utility Transfers**
   - Arrange for electricity bill transfer
   - Set up water supply
   - Internet connection setup

3. **Safety Measures**
   - Change locks if needed
   - Verify fire exits
   - Check smoke detectors

By following this comprehensive checklist, you can ensure a smooth rental experience in Nepal.
        `,
        author: 'Bikram Adhikari',
        date: '2024-05-10',
        category: 'Renting Guide',
        tags: ['checklist', 'rental agreement', 'inspection'],
        featuredImage: '/room2.jpg',
      },
      {
        id: 3,
        title: 'Understanding Tenant Rights in Nepal',
        slug: 'tenant-rights-nepal',
        excerpt:
          'Learn about your legal protections as a renter under Nepali law.',
        content: `
# Understanding Tenant Rights in Nepal

As a tenant in Nepal, it's important to know your legal rights and protections. Here's what you need to know about rental laws in Nepal.

## 1. Right to Habitable Premises

Landlords must provide:
- Safe and structurally sound property
- Working plumbing and electricity
- Proper sanitation facilities
- Reasonable security measures

## 2. Rent Increase Regulations

- Landlord must provide written notice (typically 30 days)
- Increases should be reasonable and justified
- Frequency of increases should be specified in contract

## 3. Security Deposit Rules

- Standard is 1-3 months rent
- Must be refunded within 15-30 days after moving out
- Deductions only for legitimate damages beyond normal wear

## 4. Privacy Rights

- Landlord cannot enter without notice (except emergencies)
- 24-hour notice recommended for inspections/repairs
- Right to peaceful enjoyment of property

## 5. Termination of Tenancy

- Notice period typically 1 month (check contract)
- Early termination conditions should be specified
- Cannot be evicted without proper notice and cause

## 6. Dispute Resolution

Options include:
- Mediation through community leaders
- Filing complaint with local authorities
- Legal action through courts if necessary

## 7. Special Protections

- Protection against discrimination
- Right to basic utilities
- Protection from unlawful eviction

Remember, while these are general principles, your specific rental agreement may have additional terms. Always read contracts carefully before signing.
        `,
        author: 'Saroj Neupane',
        date: '2024-04-28',
        category: 'Legal Guide',
        tags: ['tenant rights', 'legal', 'nepal law'],
        featuredImage: '/room3.jpg',
      },
      {
        id: 4,
        title: 'Best Areas for Expats to Live in Kathmandu',
        slug: 'expats-kathmandu-areas',
        excerpt:
          'A guide to the most expat-friendly neighborhoods in Kathmandu Valley.',
        content: `
# Best Areas for Expats to Live in Kathmandu

Kathmandu offers several neighborhoods that are particularly popular with expatriates. Here's our guide to the best areas based on amenities, community, and lifestyle.

## 1. Lazimpat

**Pros:**
- Close to embassies and international organizations
- Good selection of international restaurants
- Relatively quiet and green
- Walking distance to Thamel

**Cons:**
- Higher rental prices
- Limited parking availability

**Best for:** Diplomats, NGO workers, those who want proximity to Thamel

## 2. Boudha

**Pros:**
- Strong international community
- Many vegetarian/vegan dining options
- Spiritual atmosphere
- Good local markets

**Cons:**
- Can be noisy during festivals
- Traffic congestion

**Best for:** Spiritual seekers, long-term visitors

## 3. Patan (Lalitpur)

**Pros:**
- Rich cultural heritage
- Good international schools
- More spacious accommodations
- Less polluted than central Kathmandu

**Cons:**
- Further from central business districts
- Limited nightlife

**Best for:** Families, culture enthusiasts

## 4. Jhamsikhel

**Pros:**
- Trendy cafes and restaurants
- International standard gyms
- Good security
- Expat-friendly shops

**Cons:**
- Higher cost of living
- Can feel "bubble-like"

**Best for:** Young professionals, foodies

## 5. Budhanilkantha

**Pros:**
- Clean air and mountain views
- Larger properties available
- Quiet environment
- Close to hiking trails

**Cons:**
- Far from city center
- Limited dining options

**Best for:** Nature lovers, remote workers

When choosing an area, consider your daily commute, budget, and lifestyle preferences. Many expats start in central areas like Lazimpat before exploring other neighborhoods.
        `,
        author: 'Emma Thompson',
        date: '2024-04-15',
        category: 'Area Guide',
        tags: ['expats', 'kathmandu', 'neighborhoods'],
        featuredImage: '/room1.jpg',
      },
    ],
  },
};

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get page content
export const getPageContent = async (pageSlug) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/pages/${pageSlug}`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return data.page;
  } catch (error) {
    console.error('Error fetching page content:', error);
    // Fallback to mock data
    return CMS_PAGES[pageSlug] || null;
  }
};

// Get blog posts
export const getBlogPosts = async (limit = 10, offset = 0) => {
  try {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`${API_URL}/api/cms/blog?${queryParams}`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return {
      posts: data.posts || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to mock data
    const posts = CMS_PAGES.blog.posts
      .slice(offset, offset + limit)
      .map((post) => ({
        ...post,
        content: undefined, // Don't send full content in list view
      }));

    return {
      posts,
      total: CMS_PAGES.blog.posts.length,
    };
  }
};

// Get single blog post
export const getBlogPost = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/blog/${slug}`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return data.post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    // Fallback to mock data
    const post = CMS_PAGES.blog.posts.find((post) => post.slug === slug);
    return post || null;
  }
};

// Get blog categories
export const getBlogCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/cms/blog/categories`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    // Fallback to mock data
    const categories = [
      ...new Set(CMS_PAGES.blog.posts.map((post) => post.category)),
    ];
    return categories;
  }
};

// Get blog tags
export const getBlogTags = async () => {
  try {
    const response = await fetch(`${API_URL}/api/cms/blog/tags`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return data.tags || [];
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    // Fallback to mock data
    const tags = [
      ...new Set(CMS_PAGES.blog.posts.flatMap((post) => post.tags)),
    ];
    return tags;
  }
};

// Admin CMS functions
export const createPage = async (pageData) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/pages`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(pageData),
    });

    const data = await handleApiResponse(response);
    return { success: true, page: data.page };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updatePage = async (pageId, pageData) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/pages/${pageId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(pageData),
    });

    const data = await handleApiResponse(response);
    return { success: true, page: data.page };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createBlogPost = async (postData) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/blog`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(postData),
    });

    const data = await handleApiResponse(response);
    return { success: true, post: data.post };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateBlogPost = async (postId, postData) => {
  try {
    const response = await fetch(`${API_URL}/api/cms/blog/${postId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(postData),
    });

    const data = await handleApiResponse(response);
    return { success: true, post: data.post };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
