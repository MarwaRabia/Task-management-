/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppSelector } from "../../../app/hooks";
// import StatCard from "../components/StatCard";
import "./dashboard.css";
import type { Project } from "@/types/project.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, Column } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import api from "../../../services/api";
import "./Dashboard.css";
import type { DashboardStats } from "../../../types/dashboard.types";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    myTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadStats(), loadMyTasks(), loadRecentProjects()]);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
 
      try {
        const [projectsRes, tasksRes, myTasksRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
          api.get("/tasks/my-tasks"),
        ]);

        const projects = projectsRes.data.data || projectsRes.data;
        const tasks = tasksRes.data.data || tasksRes.data;
        const myTasksData = myTasksRes.data.data || myTasksRes.data;

        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter((p: Project) => p.status === "Active")
            .length,
          completedProjects: projects.filter(
            (p: Project) => p.status === "Completed"
          ).length,
          totalTasks: tasks.length,
          myTasks: myTasksData.length,
          pendingTasks: tasks.filter(
            (t: any) => t.status === "Todo" || t.status === 1
          ).length,
          completedTasks: tasks.filter(
            (t: any) => t.status === "Done" || t.status === 3
          ).length,
          overdueTasks: tasks.filter((t: any) => t.isOverdue).length,
        });
      } catch (fallbackError) {
        console.error("Failed to calculate stats", fallbackError);
      }
    // }
  };

  const loadMyTasks = async () => {
    try {
      const response = await api.get("/tasks/my-tasks");
      const tasks = response.data.data || response.data;

   
      // Sort by due date and take first 5
      const sortedTasks = tasks
        .filter((t: any) => t.status !=3 )
        .sort(
          (a: any, b: any) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
        .slice(0, 5);

      setMyTasks(sortedTasks);
    } catch (error) {
      console.error("Failed to load my tasks", error);
    }
  };

  const loadRecentProjects = async () => {
    try {
      const response = await api.get("/projects");
      const projects = response.data.data || response.data;

      // Sort by created date and take first 5
      const sortedProjects = projects
        .sort(
          (a: Project, b: Project) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);

      setRecentProjects(sortedProjects);
    } catch (error) {
      console.error("Failed to load recent projects", error);
    }
  };


  const getPriorityLabel = (priority: string | number) => {
    const priorityMap: Record<string, string> = {
      "1": "Low",
      "2": "Medium",
      "3": "High",
      Low: "Low",
      Medium: "Medium",
      High: "High",
    };
    return priorityMap[String(priority)] || String(priority);
  };

  const getPriorityColor = (priority: string | number) => {
    const colorMap: Record<string, string> = {
      "1": "#17a2b8",
      "2": "#fd7e14",
      "3": "#dc3545",
      Low: "#17a2b8",
      Medium: "#fd7e14",
      High: "#dc3545",
    };
    return colorMap[String(priority)] || "#6c757d";
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderPriorityCell = (data: any) => {
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "8px",
          background: getPriorityColor(data.value),
          color: "white",
          fontSize: "11px",
          fontWeight: "600",
        }}
      >
        {getPriorityLabel(data.value)}
      </span>
    );
  };

  const renderDueDateCell = (data: any) => {
    const isOverdue = data.data.isOverdue;
    const color = isOverdue ? "#dc3545" : "#666";

    return (
      <span style={{ color, fontWeight: isOverdue ? "600" : "normal" }}>
        {formatDate(data.value)}
        {isOverdue && " ⚠️"}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <LoadPanel visible={loading} />

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="quick-actions">
          <Button
            text="New Project"
            icon="plus"
            onClick={() => navigate("/projects")}
            stylingMode="outlined"
          />
          <Button
            text="New Task"
            icon="plus"
            type="default"
            onClick={() => navigate("/tasks")}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <i className="dx-icon-folder"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
            <span className="stat-detail">{stats.activeProjects} Active</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <i className="dx-icon-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
            <span className="stat-detail">Great progress!</span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <i className="dx-icon-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.myTasks}</h3>
            <p>My Tasks</p>
            <span className="stat-detail">{stats.pendingTasks} Pending</span>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">
            <i className="dx-icon-warning"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue Tasks</p>
            <span className="stat-detail">Need attention</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="dashboard-content">
        {/* Left Column - My Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="dx-icon-taskcomplete"></i>
              My Upcoming Tasks
            </h2>
            <Button
              text="View All"
              onClick={() => navigate("/tasks")}
              stylingMode="text"
            />
          </div>

          {myTasks.length > 0 ? (
            <DataGrid
              dataSource={myTasks}
              showBorders={false}
              showColumnLines={false}
              rowAlternationEnabled={false}
              hoverStateEnabled={true}
            >
              <Column dataField="title" caption="Task" width="50%" />
              <Column
                dataField="priority"
                caption="Priority"
                width="25%"
                cellRender={renderPriorityCell}
              />
              <Column
                dataField="dueDate"
                caption="Due Date"
                width="25%"
                cellRender={renderDueDateCell}
              />
            </DataGrid>
          ) : (
            <div className="empty-state">
              <i
                className="dx-icon-check"
                style={{ fontSize: "48px", color: "#ccc" }}
              ></i>
              <p>No pending tasks</p>
              <Button
                text="Create Task"
                onClick={() => navigate("/tasks")}
                type="default"
              />
            </div>
          )}
        </div>

        {/* Right Column - Recent Projects */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="dx-icon-folder"></i>
              Recent Projects
            </h2>
            <Button
              text="View All"
              onClick={() => navigate("/projects")}
              stylingMode="text"
            />
          </div>

          {recentProjects.length > 0 ? (
            <div className="projects-list">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-meta">
                    <span className={`project-status status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i
                className="dx-icon-folder"
                style={{ fontSize: "48px", color: "#ccc" }}
              ></i>
              <p>No projects yet</p>
              <Button
                text="Create Project"
                onClick={() => navigate("/projects")}
                type="default"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
