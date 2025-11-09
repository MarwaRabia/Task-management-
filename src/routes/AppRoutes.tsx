/* eslint-disable @typescript-eslint/no-unused-vars */
// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@features/auth/pages/Login";

import Dashboard from "@features/dashboard/pages/DashboardPage";
import { useAppSelector } from "../app/hooks";
import type { JSX } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProjectList from "../features/projects/pages/ProjectList";
import TaskList from "../features/tasks/pages/TaskList";
import UserProfile from "../features/profile/pages/UserProfile";
import TeamPage from "../features/team/pages/TeamPage";
import ProjectDetails from "../features/projects/pages/ProjectDetails";
import TaskDetails from "../features/tasks/pages/TaskDetails";
import MemberProfile from "../features/team/pages/MemberProfile";
import SettingsPage from "../features/settings/pages/SettingsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import Register from "../features/auth/pages/Register";
import ProjectActivityLog from "../features/projects/pages/ProjectActivityLog";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }

          // element={<MainLayout />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:id" element={<MemberProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          // Route
<Route path="/projects/:projectId/activity" element={<ProjectActivityLog />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
