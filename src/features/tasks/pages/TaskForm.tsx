/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  Form,
  SimpleItem,
  GroupItem,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { createTask, updateTask } from "../tasksSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProjects } from "../../projects/projectsSlice";
import notify from "devextreme/ui/notify";
import api from "../../../services/api";

interface TaskFormProps {
  task?: any;
  onClose: (refresh: boolean) => void;
  editMode: boolean;
}

const TaskForm = ({ task, onClose, editMode }: TaskFormProps) => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { allTasks } = useAppSelector((state) => state.tasks);
  // const validationGroupRef =useRef<ValidationGroupType | null>(null);
  // const validationGroupRef = useRef<any>(null);
  const formRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: 0,
    assignedToId: 0,
    status: "Todo",
    priority: "Medium",
    dueDate: new Date(),
  });

  const fetchProjectMembers = async (projectId: number) => {
    if (!projectId) {
      setProjectMembers([]);
      return;
    }

    setLoadingMembers(true);
    try {
      const response = await api.get(`/Projects/${projectId}/members`);
      setProjectMembers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch project members", error);
      setProjectMembers([]);
      notify("Failed to load project members", "error", 2000);
    } finally {
      setLoadingMembers(false);
    }
  };

  // useEffect(() => {
  //   if (formData.projectId) {
  //     fetchProjectMembers(formData.projectId);
  //   } else {
  //     setProjectMembers([]);
  //   }
  // }, [formData.projectId]);

  useEffect(() => {
    dispatch(fetchProjects());
    fetchUsers();
  }, [dispatch]);

  const getStatusLabel = (status: number | string): string => {
    const map: Record<number | string, string> = {
      1: "Todo",
      2: "InProgress",
      3: "Done",
      Todo: "Todo",
      InProgress: "InProgress",
      Done: "Done",
    };
    return map[status] || "Todo";
  };

  const getPriorityLabel = (priority: number | string): string => {
    const map: Record<number | string, string> = {
      1: "Low",
      2: "Medium",
      3: "High",
      Low: "Low",
      Medium: "Medium",
      High: "High",
    };
    return map[priority] || "Medium";
  };

  useEffect(() => {
    if (task && editMode) {
      const updatedFormData = {
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId || 0,
        assignedToId: task.assignedToId || 0,
        status: getStatusLabel(task.status),
        priority: getPriorityLabel(task.priority),
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      };

      setFormData(updatedFormData);

    
      if (updatedFormData.projectId) {
        fetchProjectMembers(updatedFormData.projectId);
      }
    }
  }, [task, editMode]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsers([
        { id: 1, fullName: "Ahmed Ali" },
        { id: 2, fullName: "Sara Mohamed" },
        { id: 3, fullName: "Omar Hassan" },
      ]);
    }
  };

  const statusOptions = ["Todo", "InProgress", "Done"];
  const priorityOptions = ["Low", "Medium", "High"];

  const projectsData = projects.map((p) => ({
    id: p.id,
    name: p.name,
  }));



  const checkDuplicates = () => {
    // Filter tasks by selected project
    const projectTasks = allTasks.filter(
      (t: any) => t.projectId === formData.projectId
    );

    // Exclude current task if editing
    const tasksToCheck = projectTasks.filter((t: any) =>
      editMode && task ? t.id !== task.id : true
    );

    // Check if title already exists
    const titleExists = tasksToCheck.some(
      (t: any) =>
        t.title?.toLowerCase().trim() === formData.title.toLowerCase().trim()
    );

    if (titleExists) {
      notify("Task title already exists in this project", "error", 3000);
      return false;
    }

    // Check if description already exists
    const descriptionExists = tasksToCheck.some(
      (t: any) =>
        t.description?.toLowerCase().trim() ===
        formData.description.toLowerCase().trim()
    );

    if (descriptionExists) {
      notify("Task description already exists in this project", "error", 3000);
      return false;
    }

    return true;
  };


  const handleClose = (refresh: boolean) => {
  setFormData({
    title: "",
    description: "",
    projectId: 0,
    assignedToId: 0,
    status: "Todo",
    priority: "Medium",
    dueDate: new Date(),
  });
  onClose(refresh);
};
  const handleSubmit = async () => {
    // e.preventDefault();
    // const validationResult = validationGroupRef.current?.instance()?.validate();

    // if (!validationResult?.isValid) {
    //   notify("Please fill all required fields", "warning", 2000);
    //   return;
    // }

    // const validationResult = formRef.current?.instance().validate();
      const formInstance = formRef.current?.instance();
  const validationResult = formInstance.validate({ 
    // forces validation even for untouched fields
    isValid: true,
    showValidationSummary: true 
  });
    if (!validationResult.isValid) {
      notify("Please fill all required fields", "warning", 2000);
      return;
    }

    // if (
    //   !formData.title ||
    //   !formData.projectId ||
    //   !formData.description ||
    //   !formData.priority
    // ) {
    //   // notify("Please fill all required fields", "warning", 2000);
    //   return;
    // }

    const isUnique = checkDuplicates();
    if (!isUnique) {
      return;
    }

    setLoading(true);

    // Map strings to enum values
    const getStatusValue = (status: string): number => {
      const map: Record<string, number> = { Todo: 1, InProgress: 2, Done: 3 };
      return map[status] ?? 1;
    };

    const getPriorityValue = (priority: string): number => {
      const map: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
      return map[priority] ?? 1;
    };

    const payload = {
      title: formData.title,
      description: formData.description,
      projectId: Number(formData.projectId),
      assignedToId: Number(formData.assignedToId),
      status: getStatusValue(formData.status),
      priority: getPriorityValue(formData.priority),
      dueDate: formData.dueDate,
    };

    try {
      if (editMode && task) {
        await dispatch(
          updateTask({
            id: task.id,
            ...payload,
          })
        ).unwrap();

        notify("Task updated successfully", "success", 2000);
        onClose(true);
      } else {
        await dispatch(createTask(payload)).unwrap();

        notify("Task created successfully", "success", 2000);
        onClose(true);
      }
    } catch (error: any) {
      notify(error || "An error occurred", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      {/* <ValidationGroup ref={validationGroupRef}> */}
      <Form
        ref={formRef}
        formData={formData}
         onFieldDataChanged={(e: any) =>
    setFormData((prev: any) => ({ ...prev, [e.dataField]: e.value }))
  }
        labelLocation="top"
        showColonAfterLabel={false}
        validationGroup="taskValidation"
      >
        <SimpleItem
          dataField="title"
          editorType="dxTextBox"
          editorOptions={{
            valueChangeEvent: "keyup", // Validate on every keystroke
             validationStatus: "valid"
          }}
        >
          <Label text="Task Title" />
          <RequiredRule message="Task title is required" />
        </SimpleItem>

        <SimpleItem
          dataField="description"
          editorType="dxTextBox"
          editorOptions={{
            height: 70,
            valueChangeEvent: "keyup",
            validationStatus: "valid" // Validate on every keystroke
          }}
        >
          <Label text="Description" />
          <RequiredRule message="Description is required" />
        </SimpleItem>

        <GroupItem colCount={2}>
          <SimpleItem
            dataField="projectId"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: projectsData,
              displayExpr: "name",
              valueExpr: "id",
              searchEnabled: true,
              placeholder: "Select project",

              onValueChanged: (e: any) => {
                const newProjectId = e.value;
                setFormData((prev) => ({
                  ...prev,
                  projectId: newProjectId,
                  assignedToId: 0,
                }));

                if (newProjectId) {
                  fetchProjectMembers(newProjectId);
                } else {
                  setProjectMembers([]);
                }
              },
            }}
          >
            <Label text="Project" />
            <RequiredRule message="Project is required" />
          </SimpleItem>

          <SimpleItem
            dataField="assignedToId"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: projectMembers,
              displayExpr: "fullName",
              valueExpr: "userId",
              searchEnabled: true,
              placeholder: loadingMembers
                ? "Loading members..."
                : "Select user",
              disabled: loadingMembers || projectMembers.length === 0,
              noDataText: formData.projectId
                ? "No members in this project"
                : "Select a project first",
            }}
          >
            <Label text="Assign To" />
            {/* <RequiredRule message="Assigned user is required" /> */}
          </SimpleItem>
        </GroupItem>

        <GroupItem colCount={2}>
          <SimpleItem
            dataField="status"
            editorType="dxSelectBox"
            editorOptions={{
              items: statusOptions,
              searchEnabled: false,
            }}
          >
            <Label text="Status" />
            <RequiredRule message="Status is required" />
          </SimpleItem>

          <SimpleItem
            dataField="priority"
            editorType="dxSelectBox"
            editorOptions={{
              items: priorityOptions,
              searchEnabled: false,
            }}
          >
            <Label text="Priority" />
            <RequiredRule message="Priority is required" />
          </SimpleItem>
        </GroupItem>
        <SimpleItem dataField="dueDate" editorType="dxDateBox">
          <Label text="Due Date" />
          <RequiredRule message="Due date is required" />
        </SimpleItem>
      </Form>
      {/* </ValidationGroup> */}

      <div className="form-buttons">
        <Button
          text="Cancel"
          // onClick={() => onClose(false)}
           onClick={() => handleClose(false)}
          disabled={loading}
        />
        <Button
          text={editMode ? "Update" : "Create"}
          type="default"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default TaskForm;
