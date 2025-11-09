/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAllTasks,
  fetchMyTasks,
  deleteTask,
  clearFilters,
  setFilters,
  fetchUnassignedTasks
} from "../tasksSlice";
import TaskForm from "./TaskForm.tsx";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import "./Tasks.css";
import api from "../../../services/api.ts";
import { fetchProjects } from "../../projects/projectsSlice.ts";
import { useNavigate } from "react-router-dom";


// import _ from 'lodash';

import {
  DataGrid,
  Column,
  Paging,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { SelectBox } from "devextreme-react/select-box";
import { CheckBox } from "devextreme-react/check-box";
import { Popup } from "devextreme-react/popup";
import { LoadPanel } from "devextreme-react/load-panel";

interface User {
  id: number;
  fullName: string;
  email?: string;
}

const TaskList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allTasks, myTasks, loading, filters ,unassignedTasks} = useAppSelector(
    (state) => state.tasks
  );
  const { projects } = useAppSelector((state) => state.projects);

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "my"|"unassigned">("all");

    // const [localFilters, setLocalFilters] = useState(filters);

  //    const debouncedFilterChange = useRef(
  //   _.debounce((newFilters) => {
  //     dispatch(setFilters(newFilters));
  //   }, 500) // Wait 500ms after user stops typing
  // ).current;

  // // Cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     debouncedFilterChange.cancel();
  //   };
  // }, [debouncedFilterChange]);

  

  const handleRowClick = (e: any) => {
    if (e.rowType === "data") {
      navigate(`/tasks/${e.data.id}`);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);



  useEffect(() => {
    loadTasks();
  }, [filters, activeTab]);


  const loadInitialData = async () => {
    // await Promise.all([dispatch(fetchProjects()), fetchUsers()]);
    // loadTasks();

    await Promise.all([
    dispatch(fetchProjects()), 
    fetchUsers(),
    // Fetch all task types on initial load
    dispatch(fetchAllTasks(filters)),
    dispatch(fetchMyTasks()),
    dispatch(fetchUnassignedTasks())
  ]);

  };

  const loadTasks = () => {
    if (activeTab === "all") {
      dispatch(fetchAllTasks(filters));
    } else if (activeTab === "my"){
      dispatch(fetchMyTasks());
    }
    else {
      dispatch(fetchUnassignedTasks())
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      const userData = response.data.data || response.data;
      setUsers(userData);
    } catch (error) {
      // Mock data fallback
      setUsers([
        { id: 1, fullName: "Ahmed Ali" },
        { id: 2, fullName: "Sara Mohamed" },
        { id: 3, fullName: "Omar Hassan" },
      ]);
    }
  };

  const currentTasks = useMemo(() => {
    if(activeTab==="all"){
      return allTasks.filter(t=>t.assignedToName!=null)
    }else if(activeTab==="my"){
      return myTasks
    }else{
      return unassignedTasks
    }
    
  }, [activeTab, allTasks, myTasks,unassignedTasks]);

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setFilters({ ...filters, [field]: value }));

     // Update local state immediately for instant UI feedback
    // const newFilters = { ...localFilters, [field]: value };
    // setLocalFilters(newFilters);
    
    // // Debounce the actual API call
    // debouncedFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    //  const emptyFilters = {
    //   projectId: null,
    //   status: null,
    //   priority: null,
    //   assignedToId: null,
    //   isOverdue: false
    // };
    // setLocalFilters(emptyFilters);
    dispatch(clearFilters());
  };

  const handleAddNew = () => {
    setEditMode(false);
    setSelectedTaskData(null);
    setShowFormPopup(true);
  };

  const handleEdit = useCallback((task: any) => {
    setEditMode(true);
    setSelectedTaskData(task);
    setShowFormPopup(true);
  }, []);

  const handleDelete = useCallback(
    async (taskId: number) => {
      const result = await confirm(
        "Are you sure you want to delete this task?",
        "Confirm Delete"
      );

      if (result) {
        try {
          await dispatch(deleteTask(taskId)).unwrap();
          notify("Task deleted successfully", "success", 2000);
          loadTasks();
        } catch (error) {
          notify("Failed to delete task", "error", 2000);
        }
      }
    },
    [dispatch]
  );

  const handleFormClose = (refresh: boolean) => {
    setShowFormPopup(false);
    setSelectedTaskData(null);
    if (refresh) {
      loadTasks();
    }
  };

  // const getStatusColor = (status: string) => {
  //   const colors: Record<string, string> = {
  //     Todo: "#6c757d",
  //     InProgress: "#ffc107",
  //     Done: "#28a745",
  //   };
  //   return colors[status] || "#6c757d";
  // };

  const getStatusColor = (status: string | number) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      "1": { color: "#6c757d", label: "To Do" },
      "2": { color: "#ffc107", label: "In Progress" },
      "3": { color: "#28a745", label: "Done" },
      Todo: { color: "#6c757d", label: "To Do" },
      InProgress: { color: "#ffc107", label: "In Progress" },
      Done: { color: "#28a745", label: "Done" },
    };
    return (
      statusMap[String(status)] || { color: "#6c757d", label: String(status) }
    );
  };

  const getPriorityColor = (priority: string | number) => {
    const priorityMap: Record<string, { color: string; label: string }> = {
      "1": { color: "#17a2b8", label: "Low" },
      "2": { color: "#fd7e14", label: "Medium" },
      "3": { color: "#dc3545", label: "High" },
      Low: { color: "#17a2b8", label: "Low" },
      Medium: { color: "#fd7e14", label: "Medium" },
      High: { color: "#dc3545", label: "High" },
    };
    return (
      priorityMap[String(priority)] || {
        color: "#6c757d",
        label: String(priority),
      }
    );
  };

  const renderStatusCell = (data: any) => {
    const statusInfo = getStatusColor(data.value);

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          background: statusInfo.color,
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {statusInfo.label}
      </span>
    );
  };

  const renderPriorityCell = (data: any) => {
    const priorityInfo = getPriorityColor(data.value);
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          background: priorityInfo.color,
          color: "white",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {priorityInfo.label}
      </span>
    );
  };

  const renderAssignedCell = (data: any) => {
    return <span>{data.data.assignedToName || "Unassigned"}</span>;
  };

  const renderTitleCell = (data: any) => {
    return (
      <div>
        {data.value}
        {data.data.isOverdue && (
          <span
            style={{
              marginLeft: "8px",
              padding: "2px 8px",
              borderRadius: "8px",
              background: "#dc3545",
              color: "white",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            OVERDUE
          </span>
        )}
      </div>
    );
  };

  const renderActionsCell = (data: any) => {
    return (
      <div className="action-buttons">
        <Button
          icon="eyeopen"
          hint="View Details"
          onClick={() => navigate(`/tasks/${data.data.id}`)}
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

  const statusOptions = ["Todo", "InProgress", "Done"];
  const priorityOptions = ["Low", "Medium", "High"];

  return (
    <div className="tasks-container">
      <LoadPanel visible={loading} />

      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p className="page-subtitle">Manage and track your tasks</p>
        </div>
        <Button
          text="New Task"
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
          📊 All Tasks ({allTasks.filter(t=>t.assignedToName!=null).length})
        </button>
        <button
          className={`tab-button ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          👤 My Tasks ({myTasks.length})
        </button>

        <button
          className={`tab-button ${activeTab === "unassigned" ? "active" : ""}`}
          onClick={() => setActiveTab("unassigned")}
        >
          👤 Unassigned Tasks ({unassignedTasks.length})
        </button>
      </div>

      {/* Filters - Only for All Tasks */}
      {activeTab === "all" && (
        <div className="filters-container">
          <div className="filters-row">
            <SelectBox
              placeholder="Filter by Project"
              dataSource={projects}
              displayExpr="name"
              valueExpr="id"
              value={filters.projectId}
              onValueChanged={(e) => handleFilterChange("projectId", e.value)}
              showClearButton={true}
              width={200}
            />

            <SelectBox
              placeholder="Filter by Status"
              items={statusOptions}
              value={filters.status}
              onValueChanged={(e) => handleFilterChange("status", e.value)}
              showClearButton={true}
              width={180}
            />

            <SelectBox
              placeholder="Filter by Priority"
              items={priorityOptions}
              value={filters.priority}
              onValueChanged={(e) => handleFilterChange("priority", e.value)}
              showClearButton={true}
              width={180}
            />

            <SelectBox
              placeholder="Filter by Assigned To"
              dataSource={users}
              displayExpr="fullName"
              valueExpr="id"
              value={filters.assignedToId}
              onValueChanged={(e) =>
                handleFilterChange("assignedToId", e.value)
              }
              showClearButton={true}
              searchEnabled={true}
              width={200}
            />

            <CheckBox
              text="Overdue Only"
              value={filters.isOverdue || false}
              onValueChanged={(e) => handleFilterChange("isOverdue", e.value)}
            />

            <Button
              text="Clear Filters"
              icon="clear"
              onClick={handleClearFilters}
              stylingMode="outlined"
            />
          </div>
        </div>
      )}

      {/* DataGrid */}
      <div className="tasks-grid-container">
        <DataGrid
          dataSource={currentTasks}
          keyExpr="id"
          width="100%"
          columnResizingMode="widget"
          showBorders={true}
          showRowLines={true}
          showColumnLines={false}
          rowAlternationEnabled={true}
          // columnAutoWidth={true}
          hoverStateEnabled={true}
          onRowClick={handleRowClick}
        >
          <SearchPanel
            visible={true}
            width={240}
            placeholder="Search tasks..."
          />
          <Paging defaultPageSize={15} />
          <Pager
            visible={true}
            showPageSizeSelector={true}
            allowedPageSizes={[10, 15, 25, 50]}
            showInfo={true}
          />

          <Column
            dataField="title"
            caption="Task Title"
            width={300}
            cellRender={renderTitleCell}
          />
          <Column dataField="projectName" caption="Project" width={180} />
          <Column
            dataField="assignedToName"
            caption="Assigned To"
            width={150}
            cellRender={renderAssignedCell}
          />
          <Column
            dataField="status"
            caption="Status"
            width={130}
            cellRender={renderStatusCell}
          />
          <Column
            dataField="priority"
            caption="Priority"
            width={100}
            cellRender={renderPriorityCell}
          />
          <Column
            dataField="dueDate"
            caption="Due Date"
            dataType="date"
            width={120}
            customizeText={(data) => formatDate(data.value)}
          />
          <Column
            caption="Actions"
            width={100}
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
        hideOnOutsideClick={true}
        showTitle={true}
        title={editMode ? "Edit Task" : "New Task"}
        width={700}
        height="auto"
      >
        <TaskForm
         key={editMode && selectedTaskData ? `edit-${selectedTaskData.id}` : 'new-task'}
          task={selectedTaskData}
          onClose={handleFormClose}
          editMode={editMode}
        />
      </Popup>
    </div>
  );
};

export default TaskList;
