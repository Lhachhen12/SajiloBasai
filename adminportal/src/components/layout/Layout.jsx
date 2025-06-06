import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ sidebarOpen, toggleSidebar }) => {
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('navigate', handleRouteChange);
    
    return () => {
      window.removeEventListener('navigate', handleRouteChange);
    };
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-4">
          <Outlet />
        </main>
        
        <footer className="bg-white p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} RoomFinder Admin Dashboard
        </footer>
      </div>
    </div>
  );
};

export default Layout;