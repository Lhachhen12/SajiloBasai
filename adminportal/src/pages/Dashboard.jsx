import { useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import RecentListings from '../components/dashboard/RecentListings';

const Dashboard = () => {
  // Dummy data directly in the component
  const dashboardStats = {
    totalUsers: 150,
    totalListings: 75,
    totalInquiries: 30,
    totalVisits: 500,
    activeSellers: 60
  };

  const recentListings = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      type: 'Apartment',
      location: 'Downtown Area',
      price: 1200,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Cozy Studio near University',
      type: 'Studio',
      location: 'University District',
      price: 800,
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Luxury Penthouse with View',
      type: 'Penthouse',
      location: 'City Center',
      price: 2500,
      status: 'Active'
    },
    {
      id: 4,
      title: 'Shared Room in House',
      type: 'Room',
      location: 'Suburban Area',
      price: 500,
      status: 'Active'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back to your RoomFinder admin portal</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        <StatsCard 
          title="Total Users" 
          value={dashboardStats.totalUsers.toLocaleString()} 
          type="users" 
          percentage={12} 
          isIncrease={true} 
        />
        <StatsCard 
          title="Total Listings" 
          value={dashboardStats.totalListings.toLocaleString()} 
          type="listings" 
          percentage={8} 
          isIncrease={true} 
        />
        <StatsCard 
          title="Total Inquiries" 
          value={dashboardStats.totalInquiries.toLocaleString()} 
          type="inquiries" 
          percentage={5} 
          isIncrease={true} 
        />
        <StatsCard 
          title="Active Sellers" 
          value={dashboardStats.activeSellers.toLocaleString()} 
          type="sellers" 
          percentage={3} 
          isIncrease={false} 
        />
        <StatsCard 
          title="Total Site Visits" 
          value={dashboardStats.totalVisits.toLocaleString()} 
          type="visits" 
          percentage={15} 
          isIncrease={true} 
        />
      </div>
      
      {/* Charts & Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartPlaceholder title="User Growth" type="line" />
          <ChartPlaceholder title="Listings by City" type="bar" />
        </div>
        
        <div>
          <RecentListings listings={recentListings} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;