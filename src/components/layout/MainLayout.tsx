import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const MainLayout = () => {
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // const toggleSidebar = () => {
  //   setSidebarCollapsed(!sidebarCollapsed);
  // };

   // Initialize sidebar state based on screen size
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return window.innerWidth <= 768; // Closed on mobile by default
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Optional: Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true); // Auto-close on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <Sidebar collapsed={sidebarCollapsed}   onToggle={toggleSidebar} />
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          
          <Outlet />
        </main>
         {/* Overlay for mobile - click to close sidebar */}
      {!sidebarCollapsed && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        />
      )}
      </div>
    </div>
  );
};

export default MainLayout;