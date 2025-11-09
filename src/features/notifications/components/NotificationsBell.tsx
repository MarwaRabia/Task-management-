/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../../app/hooks';
// import {
//   fetchNotifications,
//   fetchUnreadCount,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
//   addNotification,
// } from '../notificationsSlice';
// import { signalRService } from '../../../lib/signalr/signalRService';
// import { DropDownButton } from 'devextreme-react/drop-down-button';
// import { List } from 'devextreme-react/list';
// import { Button } from 'devextreme-react/button';
// import { ScrollView } from 'devextreme-react/scroll-view';
// import notify from 'devextreme/ui/notify';
// import './NotificationsBell.css';

// interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   type: string;
//   link?: string;
//   isRead: boolean;
//   createdAt: string;
//   timeAgo: string;
// }

// const NotificationsBell: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
//   const { token } = useAppSelector((state) => state.auth);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUnreadCount());
    
//     // Connect to SignalR
//     if (token) {
//       connectSignalR();
//     }

//     return () => {
//       signalRService.stop();
//     };
//   }, [token]);

//   const connectSignalR = async () => {
//     try {
//       await signalRService.start(token!);
      
//       // Listen for new notifications
//       signalRService.on('ReceiveNotification', handleNewNotification);
//     } catch (error) {
//       console.error('Failed to connect SignalR:', error);
//     }
//   };

//   const handleNewNotification = (data: Notification) => {
//     // Add notification to state
//     dispatch(addNotification(data));
    
//     // Show toast notification
//     notify({
//       message: data.message,
//       type: getNotificationType(data.type),
//       displayTime: 4000,
//       position: { at: 'top right', my: 'top right', offset: '0 60' },
//     });

//     // Play sound
//     playNotificationSound();
//   };

//   const playNotificationSound = () => {
//     try {
//       const audio = new Audio('/sounds/notification.mp3');
//       audio.volume = 0.5;
//       audio.play().catch(err => console.log('Could not play sound:', err));
//     } catch (err) {
//       console.log('Sound not available:', err);
//     }
//   };

//   const getNotificationType = (type: string): 'success' | 'info' | 'warning' | 'error' => {
//     switch (type.toLowerCase()) {
//       case 'success':
//         return 'success';
//       case 'warning':
//         return 'warning';
//       case 'error':
//       case 'danger':
//         return 'error';
//       default:
//         return 'info';
//     }
//   };

//   const handleDropDownShown = () => {
//     setIsOpen(true);
//     // Fetch notifications when opening dropdown (unreadOnly = false to get all)
//     if (notifications.length === 0) {
//       dispatch(fetchNotifications(false));
//     }
//   };

//   const handleDropDownHidden = () => {
//     setIsOpen(false);
//   };

//   const handleNotificationClick = async (notification: Notification) => {
//           console.log("NOt",notification)
//     // Mark as read if unread
//     if (!notification.isRead) {
//       await dispatch(markAsRead(notification.id));
//     }
//      setIsOpen(false);

//     // Navigate based on notification link
// //     if (notification.link) {
// //       navigate(notification.link);
// //     }
//  setTimeout(() => {
//     if (notification.link) {
//       navigate(notification.link);
//     }
//   }, 100); // 100ms كفاية جدًا

// //     setIsOpen(false);
//   };

//   const handleMarkAllAsRead = async () => {
//     await dispatch(markAllAsRead());
//     notify({
//       message: 'تم تعليم جميع الإشعارات كمقروءة',
//       type: 'success',
//       displayTime: 2000,
//     });
//   };

//   const handleDeleteNotification = async (e: any, notificationId: number) => {
//     e.stopPropagation();
//     await dispatch(deleteNotification(notificationId));
//     notify({
//       message: 'تم حذف الإشعار',
//       type: 'success',
//       displayTime: 2000,
//     });
//   };

//   const handleViewAll = () => {
//     navigate('/notifications');
//     setIsOpen(false);
//   };

//   const getNotificationIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'success':
//         return 'check';
//       case 'warning':
//         return 'warning';
//       case 'error':
//       case 'danger':
//         return 'close';
//       case 'info':
//       default:
//         return 'info';
//     }
//   };

//   const renderNotificationItem = (notification: Notification) => {
//     return (
//       <div 
//         className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
//         onClick={() => handleNotificationClick(notification)}
//       >
//         <div className={`notification-icon notification-icon-${notification.type.toLowerCase()}`}>
//           <i className={`dx-icon-${getNotificationIcon(notification.type)}`}></i>
//         </div>
//         <div className="notification-content">
//           <div className="notification-title">{notification.title}</div>
//           <div className="notification-message">{notification.message}</div>
//           <div className="notification-time">{notification.timeAgo}</div>
//         </div>
//         <div className="notification-actions">
//           <Button
//             icon="trash"
//             stylingMode="text"
//             onClick={(e) => handleDeleteNotification(e, notification.id)}
//           />
//         </div>
//       </div>
//     );
//   };

//   const dropDownContent = () => {
//     return (
//       <div className="notifications-dropdown">
//         <div className="notifications-header">
//           <h3>الإشعارات</h3>
//           {unreadCount > 0 && (
//             <Button
//               text="تعليم الكل كمقروء"
//               stylingMode="text"
//               onClick={handleMarkAllAsRead}
//             />
//           )}
//         </div>
        
//         <ScrollView height={400}>
//           {loading && notifications.length === 0 ? (
//             <div className="notifications-loading">
//               <div className="dx-loadindicator"></div>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="notifications-empty">
//               <i className="dx-icon-bell"></i>
//               <p>لا توجد إشعارات</p>
//             </div>
//           ) : (
//             <List
//               dataSource={notifications}
//               itemRender={renderNotificationItem}
//               noDataText="لا توجد إشعارات"
//             />
//           )}
//         </ScrollView>

//         {notifications.length > 0 && (
//           <div className="notifications-footer">
//             <Button
//               text="عرض جميع الإشعارات"
//               width="100%"
//               onClick={handleViewAll}
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="notifications-bell">
//       <DropDownButton
//         icon="bell"
//         stylingMode="text"
//         dropDownOptions={{
//           width: 400,
//           onShown: handleDropDownShown,
//           onHidden: handleDropDownHidden,
//         }}
//         dropDownContentRender={dropDownContent}
//         showArrowIcon={false}
//       >
//         {unreadCount > 0 && (
//           <div className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</div>
//         )}
//       </DropDownButton>
//     </div>
//   );
// };

// export default NotificationsBell;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  addNotification,
} from '../notificationsSlice';
import { signalRService } from '../../../lib/signalr/signalRService';
import { Button } from 'devextreme-react/button';
// import { List } from 'devextreme-react/list';
import { ScrollView } from 'devextreme-react/scroll-view';
import notify from 'devextreme/ui/notify';
import './NotificationsBell.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

const NotificationsBell: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const { token } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    if (token) {
      connectSignalR();
    }

    return () => {
      signalRService.stop();
    };
  }, [token]);

  const connectSignalR = async () => {
    try {
      await signalRService.start(token!);
      signalRService.on('ReceiveNotification', handleNewNotification);
    } catch (error) {
      console.error('Failed to connect SignalR:', error);
    }
  };

  const handleNewNotification = (data: Notification) => {
    dispatch(addNotification(data));
    
    notify({
      message: data.message,
      type: getNotificationType(data.type),
      displayTime: 4000,
      position: { at: 'top right', my: 'top right', offset: '0 60' },
    });

    playNotificationSound();
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {console.log("error")}
  };

  const getNotificationType = (type: string): 'success' | 'info' | 'warning' | 'error' => {
    switch (type.toLowerCase()) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error':
      case 'danger': return 'error';
      default: return 'info';
    }
  };

  const toggleDropdown = () => {
    if (!isOpen && notifications.length === 0) {
      dispatch(fetchNotifications(false));
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await dispatch(markAsRead(notification.id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
    notify('All notifications marked as read', 'success', 2000);
  };

  const handleDeleteNotification = async (e: any, notificationId: number) => {
    e.event.stopPropagation();
    await dispatch(deleteNotification(notificationId));
    notify('Notification deleted', 'success', 2000);
  };

  const handleViewAll = () => {
//     navigate('/notifications');
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return 'check';
      case 'warning': return 'warning';
      case 'error':
      case 'danger': return 'close';
      default: return 'info';
    }
  };

  const renderNotificationItem = (notification: Notification) => {
    return (
      <div 
        key={notification.id}
        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className={`notification-icon notification-icon-${notification.type.toLowerCase()}`}>
          <i className={`dx-icon-${getNotificationIcon(notification.type)}`}></i>
        </div>
        <div className="notification-content">
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
          <div className="notification-time">{notification.timeAgo}</div>
        </div>
        <div className="notification-actions">
          <Button
            icon="trash"
            stylingMode="text"
            onClick={(e) => handleDeleteNotification(e, notification.id)}
          />
        </div>
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.notifications-bell')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notifications-bell">
      <div className="bell-button-wrapper">
        <Button
          icon="bell"
          stylingMode="text"
          onClick={toggleDropdown}
        />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="notifications-dropdown-container">
          <div className="notifications-dropdown">
            <div className="notifications-header">
             
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  text="Mark all as read"
                  stylingMode="text"
                  onClick={handleMarkAllAsRead}
                />
              )}
            </div>
            
            <ScrollView height={400}>
              {loading && notifications.length === 0 ? (
                <div className="notifications-loading">
                  <div className="dx-loadindicator"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notifications-empty">
                  <i className="dx-icon-bell"></i>
            
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map(notification => renderNotificationItem(notification))}
                </div>
              )}
            </ScrollView>

            {notifications.length > 0 && (
              <div className="notifications-footer">
                <Button
                
                  text="View all notifications"
                  width="100%"
                  onClick={handleViewAll}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;