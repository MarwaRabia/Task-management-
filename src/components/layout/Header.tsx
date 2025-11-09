/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useNavigate } from 'react-router-dom';
// import { Button } from 'devextreme-react/button';
// import { DropDownButton } from 'devextreme-react/drop-down-button';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { logout } from '../../features/auth/authSlice';
// import notify from 'devextreme/ui/notify';

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// const Header = ({ onToggleSidebar }: HeaderProps) => {
          
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
// const avatarUrl = user?.profileImage 
//   ? `http://localhost:5163${user.profileImage}` 
//   : null;



//   const handleLogout = () => {
//     dispatch(logout());
//     notify('Logged out successfully', 'info', 2000);
//     navigate('/login');
//   };

//   const userMenuItems = [
//     {
//       text: 'Profile',
//       icon: 'user',
//       onClick: () => navigate('/profile'),
//     },
//     {
//       text: 'Settings',
//       icon: 'preferences',
//       onClick: () => navigate('/settings'),
//     },
//     {
//       text: 'Logout',
//       icon: 'runner',
//       onClick: handleLogout,
//     },
//   ];

//   return (
//     <header className="app-header">
//       <div className="header-left">
//         <Button
//           icon="menu"
//           stylingMode="text"
//           onClick={onToggleSidebar}
//           hint="Toggle Sidebar"
//         />
//         <div className="header-logo">
//           <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
//             <rect width="50" height="50" rx="10" fill="#667eea"/>
//             <path d="M15 25L22 32L35 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <span className="logo-text">TaskFlow</span>
//         </div>
//       </div>

//       <div className="header-right">
//         <Button
//           icon="bell"
//           stylingMode="text"
//           hint="Notifications"
//           className="notification-btn"
//         />
        
//         <div className="user-menu">
//           <DropDownButton
//             text={user?.name || 'User'}
//             icon={"user"}
            

//             items={userMenuItems}
//             stylingMode="text"
//             dropDownOptions={{ width: 200 }}
//           />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import { DropDownButton } from 'devextreme-react/drop-down-button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import notify from 'devextreme/ui/notify';
import './Header.css';
import NotificationsBell from '../../features/notifications/components/NotificationsBell';
import api from '../../services/api';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  // Build full avatar URL
  const avatarUrl = user?.profileImage 
    ? `http://localhost:5163${user.profileImage}` 
    : null;

    // console.log("hhhhhhhhhh",api.get(`${user.profileImage}`))

  const handleLogout = () => {
    dispatch(logout());
    notify('Logged out successfully', 'info', 2000);
    navigate('/login');
  };

  const userMenuItems = [
    {
      text: 'Profile',
      icon: 'user',
      onClick: () => navigate('/profile'),
    },
    {
      text: 'Settings',
      icon: 'preferences',
      onClick: () => navigate('/settings'),
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: handleLogout,
    },
  ];

  // Custom render for DropDownButton with avatar
  const renderDropdownButton = () => {
   
    return (
      <div className="user-dropdown-wrapper">
        <div className="user-avatar-container">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={user?.name || 'User'} 
              className="user-avatar-image"
              onError={(e) => {
                // Fallback to initial if image fails
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="user-avatar-fallback" 
            style={{ display: avatarUrl ? 'none' : 'flex' }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <span className="user-name">{user?.name || 'User'}</span>
        <i className="dx-icon-spindown user-dropdown-icon"></i>
      </div>
    );
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Button
          icon="menu"
          stylingMode="text"
          onClick={onToggleSidebar}
          hint="Toggle Sidebar"
        />
        <div className="header-logo">
          <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
            <rect width="50" height="50" rx="10" fill="#667eea"/>
            <path d="M15 25L22 32L35 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>

      <div className="header-right">
        {/* <Button
          icon="bell"
          stylingMode="text"
          hint="Notifications"
          className="notification-btn"
        /> */}
        <NotificationsBell/>
        
        <div className="user-menu">
          <DropDownButton
            items={userMenuItems}
            stylingMode="text"
            dropDownOptions={{ width: 200 }}
            render={renderDropdownButton}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;