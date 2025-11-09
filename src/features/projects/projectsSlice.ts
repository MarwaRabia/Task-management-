/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../../types/project.types";

export interface ProjectMember {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface ProjectOwner {
  id: number;
  email: string;
  fullName: string;
  role: number;
  profileImage: string | null;
  createdAt: string;
}

export interface RecentTask {
  id: number;
  title: string;
  status: number;
  priority: number;
  dueDate: string;
  assignedToId: number;
  assignedToName: string;
}

export interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  status: string;
  deadline: string;
  createdAt: string;
  owner: ProjectOwner;
  members: ProjectMember[];
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  recentTasks: RecentTask[];
}

interface ProjectsState {
  projects: Project[];
  myProjects: Project[];
  selectedProject: Project | null;
  projectDetails: ProjectDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  // projects: localStorage.getItem("projects")
  //   ? JSON.parse(localStorage.getItem("projects")!)
  //   : [],
  // myProjects: localStorage.getItem("myProjects")
  //   ? JSON.parse(localStorage.getItem("myProjects")!)
  //   : [],

  myProjects:[],

  selectedProject: null,
  projectDetails: null,
  loading: false,
  error: null,
};

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchDetails",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Projects/${projectId}/details`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project details"
      );
    }
  }
);

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/projects");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.success || "Failed to fetch projects"
      );
    }
  }
);
// Fetch my projects
export const fetchMyProjects = createAsyncThunk(
  "projects/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/projects/owned");
    
      return response.data.data  || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.success || "Failed to fetch projects"
      );
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  "projects/create",
  async (project: CreateProjectDto, { rejectWithValue }) => {
    try {
      const response = await api.post("/projects", project);
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/update",
  async (project: UpdateProjectDto, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${project.id}`, project);
      return response.data.data;
    } catch (error: any) {
     
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Failed to update project";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Failed to delete project";
      return rejectWithValue(errorMessage);
  
    }
  }
);

// Get project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // setSelectedProject: (state, action) => {
    //   state.selectedProject = action.payload;
    // },
  },
  extraReducers: (builder) => {
    // Fetch all projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        // localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //Fetch my projects
    builder
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.myProjects = action.payload;
        
        // localStorage.setItem("myProjects", JSON.stringify(state.myProjects));
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) {
          return;
        }
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch project by ID
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
        localStorage.setItem("projects", JSON.stringify(state.projects));
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.projectDetails = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
