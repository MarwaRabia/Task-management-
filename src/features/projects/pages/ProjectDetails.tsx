
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProjectDetails } from "../projectsSlice";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import { ProgressBar } from "devextreme-react/progress-bar";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  Export,
  Tooltip,
} from "devextreme-react/chart";
import api from "../../../services/api";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectDetails, loading } = useAppSelector((state) => state.projects);

  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number>(4); // Default: Member
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetails(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      const response = await api.get("/users");
      setAllUsers(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  // Filter out users already in project
  const availableUsers = useMemo(() => {
    if (!projectDetails || !allUsers) return [];

    const memberIds = projectDetails.members.map((m: any) => m.userId);
    return allUsers.filter((user: any) => !memberIds.includes(user.id));
  }, [allUsers, projectDetails]);

  const handleAddMember = async () => {
    if (!selectedUserId) {
      notify("Please select a user", "warning", 2000);
      return;
    }

    setActionLoading(true);
    try {
   
      const roleMap: Record<number, string> = {
        2: "Manager",
        3: "Team Leader",
        4: "Member",
      };
      await api.post(`/projects/${id}/members`, {
        userId: selectedUserId,
        role: roleMap[selectedRole],
      });

      notify("Member added successfully", "success", 2000);
      setShowAddMemberPopup(false);
      setSelectedUserId(null);
      setSelectedRole(4);

      // Reload project details
      if (id) {
        dispatch(fetchProjectDetails(Number(id)));
      }
    } catch (error: any) {
      notify(
        error.response?.data?.message || "Failed to add member",
        "error",
        2000
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    const result = await confirm(
      "Remove this member from the project?",
      "Confirm Remove"
    );

    if (result) {
      try {
        await api.delete(`/projects/${id}/members/${memberId}`);
        notify("Member removed successfully", "success", 2000);

        // Reload project details
        if (id) {
          dispatch(fetchProjectDetails(Number(id)));
        }
      } catch (error: any) {
        notify(
          error.response?.data?.message || "Failed to remove member",
          "error",
          2000
        );
      }
    }
  };

  const getRoleLabel = (role: string | number): string => {
    const roleMap: Record<string, string> = {
      "1": "Owner",
      "2": "Manager",
      "3": "Team Leader",
      "4": "Member",
      Owner: "Owner",
      Manager: "Manager",
      TeamLeader: "Team Leader",
      Member: "Member",
    };
    return roleMap[String(role)] || String(role);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Planning: "#6c757d",
      Active: "#28a745",
      "On Hold": "#ffc107",
      Done: "#007bff",
      Cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getTaskStatusLabel = (status: number) => {
    const labels: any = {
      0: "To Do",
      1: "To Do",
      2: "In Progress",
      3: "Done",
    };
    return labels[status] || "Unknown";
  };

  const getTaskStatusColor = (status: number) => {
    const colors: any = {
      0: "#6c757d",
      1: "#6c757d",
      2: "#ffc107",
      3: "#28a745",
    };
    return colors[status] || "#6c757d";
  };

  const getPriorityLabel = (priority: number) => {
    const labels: any = {
      1: "Low",
      2: "Medium",
      3: "High",
    };
    return labels[priority] || "Unknown";
  };

  const getPriorityColor = (priority: number) => {
    const colors: any = {
      1: "#17a2b8",
      2: "#28a745",
      3: "#dc3545",
    };
    return colors[priority] || "#6c757d";
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const progressPercentage = useMemo(() => {
    if (!projectDetails || projectDetails.totalTasks === 0) return 0;
    return Math.round(
      (projectDetails.completedTasks / projectDetails.totalTasks) * 100
    );
  }, [projectDetails]);

  const chartData = useMemo(() => {
    if (!projectDetails) return [];
    return [
      { status: "To Do", count: projectDetails.todoTasks, color: "#6c757d" },
      {
        status: "In Progress",
        count: projectDetails.inProgressTasks,
        color: "#ffc107",
      },
      {
        status: "Done",
        count: projectDetails.completedTasks,
        color: "#28a745",
      },
    ];
  }, [projectDetails]);

  const overdueTasksCount = useMemo(() => {
    if (!projectDetails) return 0;
    const now = new Date();
    return projectDetails.recentTasks.filter((task: any) => {
      const dueDate = new Date(task.dueDate);
      return task.status !== 3 && dueDate < now;
    }).length;
  }, [projectDetails]);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (!projectDetails) {
    return (
      <div className="project-details-container">
        <div className="error-message">You have not access for this Project </div>
      </div>
    );
  }

  const projectRoles = [
    {
      value: 2,
      label: "⚙️ Manager",
      description: "Can manage project settings",
    },
    {
      value: 3,
      label: "👥 Team Leader",
      description: "Can manage team members",
    },
    { value: 4, label: "👤 Member", description: "Regular team member" },
  ];

  return (
    <div className="project-details-container">
      {/* Header */}
      <div className="project-details-header">
        <Button
          icon="back"
          text="Back to Projects"
          onClick={() => navigate("/projects")}
          stylingMode="text"
        />
      </div>

      {/* Project Info Card */}
      <div className="project-info-card">
        <div className="project-info-header">
          <div>
            <h1 className="project-title">{projectDetails.name}</h1>
            <p className="project-description">{projectDetails.description}</p>
          </div>
          <span
            className="project-status-badge"
            style={{ backgroundColor: getStatusColor(projectDetails.status) }}
          >
            {projectDetails.status}
          </span>
        </div>

        <div className="project-info-details">
          <div className="info-item">
            <span className="info-label">Project Owner</span>
            <span className="info-value">{projectDetails.owner.fullName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Start Date</span>
            <span className="info-value">
              {formatDate(projectDetails.createdAt)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Deadline</span>
            <span className="info-value">
              {formatDate(projectDetails.deadline)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Team Members</span>
            <span className="info-value">{projectDetails.members.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Project Progress</span>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          <ProgressBar
            min={0}
            max={100}
            value={progressPercentage}
            statusFormat={() => ""}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            <i className="dx-icon-tasks" style={{ color: "#2196f3" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{projectDetails.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            <i className="dx-icon-check" style={{ color: "#4caf50" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{projectDetails.completedTasks}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            <i className="dx-icon-clock" style={{ color: "#ff9800" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{projectDetails.inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ffebee" }}>
            <i className="dx-icon-warning" style={{ color: "#f44336" }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{overdueTasksCount}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="details-grid">
        {/* Tasks Chart */}
        <div className="details-card">
          <h3 className="card-title">Tasks Distribution</h3>
          <Chart id="tasks-chart" dataSource={chartData} palette="Soft Pastel">
            <CommonSeriesSettings
              argumentField="status"
              valueField="count"
              type="bar"
            />
            <Series />
            <Legend visible={false} />
            <Export enabled={false} />
            <Tooltip enabled={true} />
          </Chart>
        </div>

        {/* Team Members */}
        <div className="details-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 className="card-title">
              Team Members ({projectDetails.members.length})
            </h3>
            <Button
              text="Add Member"
              icon="plus"
              type="default"
              onClick={() => setShowAddMemberPopup(true)}
              stylingMode="contained"
            />
          </div>

          <div className="members-list">
            {projectDetails.members.map((member: any) => (
              <div key={member.userId} className="member-item">
                <div className="member-avatar">
                  {member.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.fullName}</div>
                  <div className="member-email">{member.email}</div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="member-role">
                    {getRoleLabel(member.role)}
                  </span>
                  {member.role !== "Owner" && member.role !== 1 && (
                    <Button
                      icon="remove"
                      hint="Remove member"
                      onClick={() => handleRemoveMember(member.userId)}
                      stylingMode="text"
                      type="danger"
                    />
                  )}
                </div>
              </div>
            ))}

            {projectDetails.members.length === 0 && (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#999" }}
              >
                <i
                  className="dx-icon-group"
                  style={{ fontSize: "48px", marginBottom: "12px" }}
                ></i>
                <p>No team members yet</p>
                <Button
                  text="Add First Member"
                  onClick={() => setShowAddMemberPopup(true)}
                  type="default"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="details-card">
        <h3 className="card-title">Recent Tasks</h3>
        <div className="tasks-list">
          {projectDetails.recentTasks.map((task: any) => (
            <div key={task.id} className="task-item">
              <div className="task-main">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className="task-assignee">
                    <i className="dx-icon-user"></i>
                    {task.assignedToName}
                  </span>
                  <span className="task-due-date">
                    <i className="dx-icon-event"></i>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
              <div className="task-badges">
                <span
                  className="task-priority-badge"
                  style={{
                    backgroundColor: getPriorityColor(task.priority),
                  }}
                >
                  {getPriorityLabel(task.priority)}
                </span>
                <span
                  className="task-status-badge"
                  style={{
                    backgroundColor: getTaskStatusColor(task.status),
                  }}
                >
                  {getTaskStatusLabel(task.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Popup */}
      <Popup
        visible={showAddMemberPopup}
        onHiding={() => {
          setShowAddMemberPopup(false);
          setSelectedUserId(null);
          setSelectedRole(4);
        }}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showTitle={true}
        title="Add Team Member"
        width={550}
        height="auto"
      >
        <LoadPanel visible={actionLoading} />

        <div style={{ padding: "20px" }}>
          <div className="add-members-section">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Search & Select User
            </label>
            <p
              style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}
            >
              💡 Type name or email to search users not in this project
            </p>

            <SelectBox
              dataSource={availableUsers}
              displayExpr="fullName"
              valueExpr="id"
              placeholder="Select user to add"
              value={selectedUserId}
              onValueChanged={(e) => setSelectedUserId(e.value)}
              searchEnabled={true}
              searchMode="contains"
              searchExpr={["fullName", "email"]}
              minSearchLength={0}
              noDataText="No users available"
              showClearButton={true}
              itemRender={(data) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {data.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "500", color: "#333" }}>
                      {data.fullName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {data.email}
                    </div>
                  </div>
                </div>
              )}
            />

            {selectedUserId && (
              <div style={{ marginTop: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Assign Role
                </label>
                <SelectBox
                  dataSource={projectRoles}
                  displayExpr="label"
                  valueExpr="value"
                  value={selectedRole}
                  onValueChanged={(e) => setSelectedRole(e.value)}
                  itemRender={(data) => (
                    <div style={{ padding: "8px" }}>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {data.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {data.description}
                      </div>
                    </div>
                  )}
                />
              </div>
            )}

            {availableUsers.length === 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  background: "#fff3cd",
                  borderRadius: "8px",
                  color: "#856404",
                }}
              >
                ℹ️ All users are already members of this project
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              paddingTop: "20px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              text="Cancel"
              onClick={() => {
                setShowAddMemberPopup(false);
                setSelectedUserId(null);
                setSelectedRole(4);
              }}
              disabled={actionLoading}
            />
            <Button
              text="Add Member"
              type="default"
              onClick={handleAddMember}
              disabled={!selectedUserId || actionLoading}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ProjectDetails;
