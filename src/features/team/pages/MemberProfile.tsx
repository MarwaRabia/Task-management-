/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import { Tabs } from "devextreme-react/tabs";
import { DataGrid, Column, Paging } from "devextreme-react/data-grid";
import api from "../../../services/api";
import notify from "devextreme/ui/notify";
import {
  getStatusLabel,
  getStatusColor,
  getPriorityLabel,
  getPriorityColor,
  getRoleLabel,
  formatDate,
} from "../../../utils/taskUtils";
import "./MemberProfile.css";

interface MemberDetails {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: number;
  profileImage?: string | null;
  createdAt: string;
  projectsCount: number;
  tasksCount: number;
  completedTasksCount: number;
  projects: Array<{
    Id: number;
    Name: string;
    Status: string;
    Role: string;
  }>;
  tasks: Array<{
    Id: number;
    Title: string;
    Status: number;
    Priority: number;
    DueDate: string;
    ProjectName: string;
  }>;
}

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (id) {
      loadMemberDetails(Number(id));
    }
  }, [id]);

  const loadMemberDetails = async (userId: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${userId}/profile`);

      if (response.data.success && response.data.data) {
       
        setMember(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to load member details", error);
      notify(
        error.response?.data?.message || "Failed to load member details",
        "error",
        2000
      );
      // navigate("/team");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !member) {
    return <LoadPanel visible={true} />;
  }

  if (!member) {
    return (
      <div className="member-profile-container">
        <div className="error-message">Member not found</div>
      </div>
    );
  }

  const completionRate =
    member.tasksCount > 0
      ? Math.round((member.completedTasksCount / member.tasksCount) * 100)
      : 0;

  const tabs = [
    { id: 0, text: "Overview" },
    { id: 1, text: "Projects" },
    { id: 2, text: "Tasks" },
  ];

  const renderProjectStatusCell = (data: any) => {
    const colors: any = {
      Planning: "#6c757d",
      Active: "#28a745",
      "On Hold": "#ffc107",
      Completed: "#007bff",
      Cancelled: "#dc3545",
    };

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          background: colors[data.value] || "#6c757d",
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {data.value}
      </span>
    );
  };

  const renderTaskStatusCell = (data: any) => {
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          background: getStatusColor(data.value),
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {getStatusLabel(data.value)}
      </span>
    );
  };

  const renderTaskPriorityCell = (data: any) => {
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          background: getPriorityColor(data.value),
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {getPriorityLabel(data.value)}
      </span>
    );
  };
    // const baseUrl=api.defaults.baseURL?.replace("api",'');


  return (
    <div className="member-profile-container">
      <LoadPanel visible={loading} />

      {/* Header */}
      <div className="member-profile-header">
        <Button
          icon="back"
          text="Back to Team"
          onClick={() => navigate("/team")}
          stylingMode="text"
        />
      </div>

      {/* Profile Card */}
      <div className="member-profile-card">
        <div className="profile-header-section">
          <div className="profile-avatar-large">
            {/* {member.fullName.charAt(0).toUpperCase()} */}
            {member.profileImage ? (
              <img
                src={`https://taskmanagementsystemapp.runasp.net${member.profileImage}`}
                className="user-avatar-img"
              />
            ) : (
              member.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{member.fullName}</h1>
            <span
              className="profile-role-badge"
              style={{
                backgroundColor:
                  member.role === 1
                    ? "#dc3545"
                    : member.role === 2
                    ? "#007bff"
                    : "#28a745",
              }}
            >
              {getRoleLabel(member.role)}
            </span>
          </div>
        </div>

        <div className="profile-contact-info">
          <div className="contact-item">
            <i className="dx-icon-email"></i>
            <a href={`mailto:${member.email}`}>{member.email}</a>
          </div>
          {member.phone && (
            <div className="contact-item">
              <i className="dx-icon-tel"></i>
              <a href={`tel:${member.phone}`}>{member.phone}</a>
            </div>
          )}
          <div className="contact-item">
            <i className="dx-icon-event"></i>
            <span>Joined {formatDate(member.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="member-stats-grid">
        <div className="member-stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <i className="dx-icon-folder" style={{ color: "#2196f3" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{member.projectsCount}</div>
            <div className="stat-label">Projects</div>
          </div>
        </div>

        <div className="member-stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <i className="dx-icon-tasks" style={{ color: "#ff9800" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{member.tasksCount}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="member-stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <i className="dx-icon-check" style={{ color: "#4caf50" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{member.completedTasksCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="member-stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            <i className="dx-icon-percent" style={{ color: "#9c27b0" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="member-details-card">
        <Tabs
          dataSource={tabs}
          selectedIndex={selectedTab}
          onSelectedIndexChange={setSelectedTab}
          keyExpr="id"
        />

        <div className="tab-content">
          {selectedTab === 0 && (
            <div className="overview-content">
              <div className="overview-section">
                <h3>About</h3>
                <p>
                  {member.fullName} is a{" "}
                  {getRoleLabel(member.role).toLowerCase()} in the team with{" "}
                  {member.projectsCount} active{" "}
                  {member.projectsCount === 1 ? "project" : "projects"} and{" "}
                  {member.tasksCount}{" "}
                  {member.tasksCount === 1 ? "task" : "tasks"}.
                </p>
              </div>

              <div className="overview-section">
                <h3>Performance Summary</h3>
                <div className="performance-stats">
                  <div className="performance-item">
                    <span className="performance-label">Tasks Completed</span>
                    <div className="performance-bar">
                      <div
                        className="performance-bar-fill"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                    <span className="performance-value">
                      {member.completedTasksCount} of {member.tasksCount}
                    </span>
                  </div>

                  <div className="performance-item">
                    <span className="performance-label">Active Projects</span>
                    <span className="performance-value-large">
                      {member.projectsCount}
                    </span>
                  </div>
                </div>
              </div>

              {member.projects.length > 0 && (
                <div className="overview-section">
                  <h3>Recent Projects</h3>
                  <div className="recent-items-list">
                    {member.projects.slice(0, 5).map((project) => {
                    
                      return (
                        <div
                          key={project.Id}
                          className="recent-item"
                          onClick={() => navigate(`/projects/${project.Id}`)}
                        >
                          <div className="recent-item-icon">
                            <i className="dx-icon-folder"></i>
                          </div>
                          <div className="recent-item-info">
                            <div className="recent-item-title">
                              {project.Name}
                            </div>
                            <div className="recent-item-meta">
                              Role: {project.Role}
                            </div>
                          </div>
                          <span
                            className="recent-item-badge"
                            style={{
                              backgroundColor:
                                project.Status === "Active"
                                  ? "#28a745"
                                  : project.Status === "Completed"
                                  ? "#007bff"
                                  : "#6c757d",
                            }}
                          >
                            {project.Status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                //           <div className="overview-section">
                //   <h3>Recent Projects</h3>

                //   {/* طباعة كل البروجكتس للـ Debug */}
                //   {member && console.log("All Projects (for debug):", member.projects)}

                //   <div className="recent-items-list">
                //     {member.projects.slice(0, 5).map((project) => {
                //       // طباعة كل بروجكت قبل الاستخدام
                //       console.log("Current Project:", project);

                //       return (
                //         <div
                //           key={project.Id}  // عدّل من id إلى Id
                //           className="recent-item"
                //           onClick={() => navigate(`/projects/${project.Id}`)}  // وهنا كمان
                //         >
                //           <div className="recent-item-icon">
                //             <i className="dx-icon-folder"></i>
                //           </div>
                //           <div className="recent-item-info">
                //             <div className="recent-item-title">
                //               {project.Name}  {/* عدّل من name إلى Name */}
                //             </div>
                //             <div className="recent-item-meta">
                //               Role: {project.Role}  {/* عدّل من role إلى Role */}
                //             </div>
                //           </div>
                //           <span
                //             className="recent-item-badge"
                //             style={{
                //               backgroundColor:
                //                 project.Status === "Active"
                //                   ? "#28a745"
                //                   : project.Status === "Completed"
                //                   ? "#007bff"
                //                   : "#6c757d",
                //             }}
                //           >
                //             {project.Status}  {/* عدّل من status إلى Status */}
                //           </span>
                //         </div>
                //       );
                //     })}
                //   </div>
                // </div>
              )}
            </div>
          )}

          {selectedTab === 1 && (
            <div className="tab-data-grid">
              <DataGrid
                dataSource={member.projects}
                keyExpr="Id"
                showBorders={false}
                showRowLines={true}
                showColumnLines={false}
                rowAlternationEnabled={true}
                hoverStateEnabled={true}
                onRowClick={(e) => navigate(`/projects/${e.data.Id}`)}
              >
                <Column dataField="Name" caption="Project Name" />
                <Column
                  dataField="Status"
                  caption="Status"
                  width={120}
                  cellRender={renderProjectStatusCell}
                />
                <Column dataField="Role" caption="Role" width={120} />
                <Paging defaultPageSize={10} />
              </DataGrid>
            </div>
          )}

          {selectedTab === 2 && (
            <div className="tab-data-grid">
              <DataGrid
                dataSource={member.tasks}
                keyExpr="Id"
                showBorders={false}
                showRowLines={true}
                showColumnLines={false}
                rowAlternationEnabled={true}
                hoverStateEnabled={true}
                onRowClick={(e) => navigate(`/tasks/${e.data.Id}`)}
              >
                <Column dataField="Title" caption="Task" />
                <Column dataField="ProjectName" caption="Project" width={180} />
                <Column
                  dataField="Status"
                  caption="Status"
                  width={120}
                  cellRender={renderTaskStatusCell}
                />
                <Column
                  dataField="Priority"
                  caption="Priority"
                  width={100}
                  cellRender={renderTaskPriorityCell}
                />
                <Column
                  dataField="DueDate"
                  caption="Due Date"
                  dataType="date"
                  width={120}
                  customizeText={(data) => formatDate(data.value)}
                />
                <Paging defaultPageSize={10} />
              </DataGrid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
