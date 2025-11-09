/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import { SelectBox } from "devextreme-react/select-box";
import { DateBox } from "devextreme-react/date-box";
import notify from "devextreme/ui/notify";
import { getTimeAgo } from "../../../utils/taskUtils";
import "./ProjectActivityLog.css";

interface ActivityLog {
  id: number;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
  entityType: string; // "Task", "Comment", "File", "Project"
  entityId: number;
}

const ProjectActivityLog = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  useEffect(() => {
    fetchActivityLog();
  }, [projectId]);

  useEffect(() => {
    applyFilters();
  }, [selectedEntityType, selectedUser, dateFrom, dateTo, activities]);

  const fetchActivityLog = async () => {
    setLoading(true);
    try {
      // Endpoint: GET /api/projects/{projectId}/activity-log
      const response = await api.get(`/projects/${projectId}/activity-log`);
      setActivities(response.data.data || response.data);
    } catch (error) {
      notify("Failed to load activity log", "error", 2000);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Filter by entity type
    if (selectedEntityType) {
      filtered = filtered.filter((a) => a.entityType === selectedEntityType);
    }

    // Filter by user
    if (selectedUser) {
      filtered = filtered.filter((a) => a.userName === selectedUser);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(
        (a) => new Date(a.createdAt) >= dateFrom
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        (a) => new Date(a.createdAt) <= dateTo
      );
    }

    setFilteredActivities(filtered);
  };

  const clearFilters = () => {
    setSelectedEntityType(null);
    setSelectedUser(null);
    setDateFrom(null);
    setDateTo(null);
  };

  const getActivityIcon = (entityType: string) => {
    const icons: Record<string, string> = {
      Task: "tasks",
      Comment: "comment",
      File: "file",
      Project: "folder",
      Status: "refresh",
    };
    return icons[entityType] || "clock";
  };

  const getActivityColor = (action: string) => {
    if (action.includes("created") || action.includes("added")) return "#28a745";
    if (action.includes("updated") || action.includes("changed")) return "#ffc107";
    if (action.includes("deleted") || action.includes("removed")) return "#dc3545";
    return "#6c757d";
  };

  const uniqueUsers = Array.from(new Set(activities.map((a) => a.userName)));
  const entityTypes = ["Task", "Comment", "File", "Project", "Status"];

  return (
    <div className="activity-log-container">
      <LoadPanel visible={loading} />

      <div className="activity-log-header">
        <div>
          <h2>Project Activity Log</h2>
          <p className="subtitle">Track all changes and activities in this project</p>
        </div>
        <Button
          text="Refresh"
          icon="refresh"
          onClick={fetchActivityLog}
          stylingMode="outlined"
        />
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <SelectBox
          placeholder="Filter by Type"
          items={entityTypes}
          value={selectedEntityType}
          onValueChanged={(e) => setSelectedEntityType(e.value)}
          showClearButton={true}
          width={150}
        />

        <SelectBox
          placeholder="Filter by User"
          items={uniqueUsers}
          value={selectedUser}
          onValueChanged={(e) => setSelectedUser(e.value)}
          showClearButton={true}
          width={200}
        />

        <DateBox
          placeholder="From Date"
          value={dateFrom}
          onValueChanged={(e) => setDateFrom(e.value)}
          showClearButton={true}
          width={150}
        />

        <DateBox
          placeholder="To Date"
          value={dateTo}
          onValueChanged={(e) => setDateTo(e.value)}
          showClearButton={true}
          width={150}
        />

        <Button
          text="Clear Filters"
          icon="clear"
          onClick={clearFilters}
          stylingMode="outlined"
        />
      </div>

      {/* Activity Timeline */}
      <div className="activity-timeline">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div
                className="activity-icon"
                style={{ backgroundColor: getActivityColor(activity.action) }}
              >
                <i className={`dx-icon-${getActivityIcon(activity.entityType)}`}></i>
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <strong>{activity.userName}</strong> {activity.action}
                  <span className="activity-type">{activity.entityType}</span>
                </div>
                {activity.details && (
                  <div className="activity-details">{activity.details}</div>
                )}
                <div className="activity-time">{getTimeAgo(activity.createdAt)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="dx-icon-clock"></i>
            <p>No activities found</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="activity-stats">
        <div className="stat-card">
          <i className="dx-icon-chart"></i>
          <div className="stat-value">{activities.length}</div>
          <div className="stat-label">Total Activities</div>
        </div>
        <div className="stat-card">
          <i className="dx-icon-user"></i>
          <div className="stat-value">{uniqueUsers.length}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <i className="dx-icon-filter"></i>
          <div className="stat-value">{filteredActivities.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActivityLog;