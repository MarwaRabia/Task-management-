/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  DataGrid,
  Column,
  Paging,
  Pager,
  SearchPanel,
  HeaderFilter,
  FilterRow,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProjects, deleteProject } from "../projectsSlice";
import ProjectForm from "./ProjectForm.tsx";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import "./Projects.css";

const ProjectList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { projects, myProjects, loading } = useAppSelector(
    (state) => state.projects
  );
 

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProjectData, setSelectedProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const currentProjects = useMemo(() => {
    return activeTab === "all" ? projects : myProjects;
  }, [activeTab, projects, myProjects]);

  const handleAddNew = () => {
    setEditMode(false);
    setSelectedProjectData(null);
    setShowFormPopup(true);
  };

  const handleEdit = useCallback((project: any) => {
    setEditMode(true);
    setSelectedProjectData(project);
    setShowFormPopup(true);
  }, []);

  const handleDelete = useCallback(
    async (projectId: string) => {
      const result = await confirm(
        "Are you sure you want to delete this project?",
        "Confirm Delete"
      );

      if (result) {
        const resultAction = await dispatch(deleteProject(projectId));
        if (deleteProject.fulfilled.match(resultAction)) {
          notify("Project deleted successfully", "success", 2000);
        } else {
          notify(resultAction.payload, "error", 2000);
        }
      }
    },
    [dispatch]
  );

  const handleViewDetails = useCallback(
    (projectId: number) => {
      navigate(`/projects/${projectId}`);
    },
    [navigate]
  );

  const handleFormClose = (refresh: boolean) => {
    setShowFormPopup(false);
    setSelectedProjectData(null);
    if (refresh) {
      dispatch(fetchProjects());
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Planning: "#6c757d",
      Active: "#28a745",
      "On Hold": "#ffc107",
      Completed: "#007bff",
      Cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const renderStatusCell = (data: any) => {
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
        {data.value}
      </span>
    );
  };

  const renderActionsCell = (data: any) => {
    return (
      <div className="action-buttons">
        <Button
          icon="eyeopen"
          hint="View Details"
          onClick={(e: any) => {
            e.event.stopPropagation();
            handleViewDetails(data.data.id);
          }}
          stylingMode="text"
        />
        <Button
          icon="edit"
          hint="Edit"
          onClick={(e: any) => {
            e.event.stopPropagation();
            handleEdit(data.data);
          }}
          stylingMode="text"
        />
        <Button
          icon="trash"
          hint="Delete"
          onClick={(e: any) => {
            e.event.stopPropagation();
            handleDelete(data.data.id);
          }}
          stylingMode="text"
          type="danger"
        />
      </div>
    );
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRowClick = (e: any) => {
    if (e.rowType === "data") {
      handleViewDetails(e.data.id);
    }
  };


  return (
    <div className="projects-container">
      <LoadPanel visible={loading} />

      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p className="page-subtitle">
            Manage your projects and track progress
          </p>
        </div>
        <Button
          text="New Project"
          icon="plus"
          type="default"
          onClick={handleAddNew}
        />
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          📊 All Projects ({projects.length})
        </button>
        <button
          className={`tab-button ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          👤 My Projects ({myProjects?.length || 0})
        </button>
      </div>

      <div className="projects-grid-container">
        <DataGrid
          dataSource={currentProjects}
          showBorders={true}
          showRowLines={true}
          showColumnLines={false}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          onRowClick={handleRowClick}
        >
          <SearchPanel
            visible={true}
            width={240}
            placeholder="Search projects..."
          />
          <HeaderFilter visible={true} />
          <FilterRow visible={false} />
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 20, 50]}
            showInfo={true}
          />

          <Column dataField="name" caption="Project Name" width={250} />
          <Column dataField="description" caption="Description" />
          <Column
            dataField="status"
            caption="Status"
            width={120}
            cellRender={renderStatusCell}
          />
          <Column
            dataField="createdAt"
            caption="Created At"
            dataType="date"
            width={120}
            customizeText={(data) => formatDate(data.value)}
          />
          <Column
            dataField="deadline"
            caption="Deadline"
            dataType="date"
            width={120}
            customizeText={(data) => formatDate(data.value)}
          />
          <Column
            caption="Actions"
            width={130}
            cellRender={renderActionsCell}
            allowFiltering={false}
            allowSorting={false}
          />
        </DataGrid>
      </div>

      <Popup
        visible={showFormPopup}
        onHiding={() => setShowFormPopup(false)}
        dragEnabled={false}
        showTitle={true}
        title={editMode ? "Edit Project" : "New Project"}
        width={600}
        height="auto"
      >
        <ProjectForm
          project={selectedProjectData}
          onClose={handleFormClose}
          editMode={editMode}
        />
      </Popup>
    </div>
  );
};

export default ProjectList;
