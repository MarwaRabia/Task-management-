// // hooks/useDashboardData.ts
// import { useState, useEffect } from 'react';
// import api from '../services/api';
// // import { Task, Project, DashboardStats } from '../types/dashboard.types';

// export const useDashboardData = () => {
//   const [myTasks, setMyTasks] = useState<Task[]>([]);
//   const [recentProjects, setRecentProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ... كل الدوال: loadStats, loadMyTasks, ...

//  const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProjects: 0,
//     activeProjects: 0,
//     completedProjects: 0,
//     totalTasks: 0,
//     myTasks: 0,
//     pendingTasks: 0,
//     completedTasks: 0,
//     overdueTasks: 0,
//   });
//   const [myTasks, setMyTasks] = useState<any[]>([]);
//   const [recentProjects, setRecentProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const controller = new AbortController();
//     loadDashboardData(controller.signal);
//     return () => controller.abort();
//   }, []);

//   return { stats, myTasks, recentProjects, loading, error, reload: loadDashboardData };
// };