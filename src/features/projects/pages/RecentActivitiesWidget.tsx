// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useEffect } from 'react';

// const RecentActivitiesWidget = ({ projectId, limit = 5 }) => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchRecentActivities();
//   }, [projectId]);

//   const fetchRecentActivities = async () => {
//     setLoading(true);
//     try {
//       // Mock API call - replace with your actual endpoint
//       const response = await fetch(`/api/projects/${projectId}/activity-log?limit=${limit}`);
//       const data = await response.json();
//       setActivities(data.data || []);
//     } catch (error) {
//       console.error('Failed to load activities:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     const intervals = {
//       year: 31536000,
//       month: 2592000,
//       week: 604800,
//       day: 86400,
//       hour: 3600,
//       minute: 60
//     };

//     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//       const interval = Math.floor(seconds / secondsInUnit);
//       if (interval >= 1) {
//         return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
//       }
//     }
//     return 'Just now';
//   };

//   const getActivityIcon = (action) => {
//     if (action.includes('created')) return '➕';
//     if (action.includes('updated')) return '✏️';
//     if (action.includes('deleted')) return '🗑️';
//     if (action.includes('commented')) return '💬';
//     if (action.includes('uploaded')) return '📎';
//     return '🔔';
//   };

//   if (loading) {
//     return (
//       <div className="widget-card">
//         <h3>Recent Activities</h3>
//         <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
//           Loading activities...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="widget-card">
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         marginBottom: '16px' 
//       }}>
//         <h3 style={{ margin: 0 }}>Recent Activities</h3>
//         <a 
//           href={`/projects/${projectId}/activity`} 
//           style={{ 
//             color: '#007bff', 
//             textDecoration: 'none',
//             fontSize: '14px'
//           }}
//         >
//           View All →
//         </a>
//       </div>

//       {activities.length > 0 ? (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {activities.map((activity) => (
//             <div 
//               key={activity.id} 
//               style={{
//                 display: 'flex',
//                 gap: '12px',
//                 padding: '12px',
//                 background: '#f8f9fa',
//                 borderRadius: '8px',
//                 borderLeft: '3px solid #007bff',
//                 transition: 'transform 0.2s',
//                 cursor: 'pointer'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
//             >
//               <div style={{ fontSize: '20px' }}>
//                 {getActivityIcon(activity.action)}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: '14px', marginBottom: '4px' }}>
//                   <strong style={{ color: '#007bff' }}>{activity.userName}</strong>{' '}
//                   {activity.action}
//                 </div>
//                 {activity.details && (
//                   <div style={{ 
//                     fontSize: '12px', 
//                     color: '#666',
//                     marginBottom: '4px' 
//                   }}>
//                     {activity.details}
//                   </div>
//                 )}
//                 <div style={{ fontSize: '11px', color: '#999' }}>
//                   {getTimeAgo(activity.createdAt)}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div style={{ 
//           textAlign: 'center', 
//           padding: '32px', 
//           color: '#999' 
//         }}>
//           <div style={{ fontSize: '48px', marginBottom: '8px' }}>📋</div>
//           <p>No recent activities</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Styling for the widget
// const styles = `
//   .widget-card {
//     background: white;
//     padding: 20px;
//     border-radius: 12px;
//     box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//   }

//   .widget-card h3 {
//     font-size: 18px;
//     color: #333;
//   }
// `;

// export default RecentActivitiesWidget;