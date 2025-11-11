/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
  Form,
  SimpleItem,
  GroupItem,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { useAppDispatch } from "../../../app/hooks";
import { createProject, updateProject } from "../projectsSlice";
import notify from "devextreme/ui/notify";
// import  './ProjectForm.css'
import "./Projects.css";

interface ProjectFormProps {
  project?: any;
  onClose: (refresh: boolean) => void;
  editMode: boolean;
}

const ProjectForm = ({ project, onClose, editMode }: ProjectFormProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    name: "",
    description: "",
    createdAt: new Date(),
    deadline: new Date(),
    status: "Planning",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (project && editMode) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
        deadline: project.deadline ? new Date(project.deadline) : new Date(),
        status: project.status || "Planning",
      });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [project, editMode]);

  const handleFieldDataChanged = useCallback((e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.dataField]: e.value,
    }));
  }, []);

  const statusOptions = [
    "Planning",
    "Active",
    "On Hold",
    "Completed",
    "Cancelled",
  ];

  const handleSubmit = async (e: any) => {
    // e.preventDefault();
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (
      !formData.name ||
      !formData.description ||
      !formData.createdAt
      // !formData.priority
    ) {
      // notify("Please fill all required fields", "warning", 2000);
      return;
    }

    setLoading(true);

    try {
      if (editMode && project) {
        const resultAction = await dispatch(
          updateProject({
            id: project.id,
            ...formData,
          })
        );

        if (updateProject.fulfilled.match(resultAction)) {
          notify("Project updated successfully", "success", 2000);
          onClose(true);
        } else {
          const errorMessage =
            resultAction.payload || "Failed to update project";
          notify(errorMessage, "error", 3000);
        }
      } else {
        const resultAction = await dispatch(createProject(formData));

        if (createProject.fulfilled.match(resultAction)) {
          notify("Project created successfully", "success", 2000);
          onClose(true);
        } else {
          notify("Failed to create project", "error", 2000);
        }
      }
    } catch (error) {
      notify("An error occurred", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form">
      <Form
        formData={formData}
        onFieldDataChanged={handleFieldDataChanged}
        labelLocation="top"
        showColonAfterLabel={false}
        validationGroup="taskValidation"
      >
        <SimpleItem
          dataField="name"
          editorType="dxTextBox"
          editorOptions={{
            valueChangeEvent: "keyup", // Validate on every keystroke
          }}
        >
          <Label text="Project Name" />
          <RequiredRule message="Project name is required" />
        </SimpleItem>

        <SimpleItem
          dataField="description"
          editorType="dxTextBox"
          colSpan={2}
          editorOptions={{
            height: 70, //
            placeholder: "Enter project description...",
            valueChangeEvent: "keyup",
          }}
        >
          <Label text="Description" />
          <RequiredRule message="Description is required" />
        </SimpleItem>

        <GroupItem colCount={2}>
          <SimpleItem dataField="createdAt" editorType="dxDateBox">
            <Label text="Start Date" />
            <RequiredRule message="Start date is required" />
          </SimpleItem>

          <SimpleItem dataField="deadline" editorType="dxDateBox">
            <Label text="End Date" />
            <RequiredRule message="End date is required" />
          </SimpleItem>
        </GroupItem>

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
      </Form>

      <div className="form-buttons">
        <Button
          text="Cancel"
          onClick={() => onClose(false)}
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

export default ProjectForm;
