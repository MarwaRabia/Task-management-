import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;