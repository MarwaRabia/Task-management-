/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/tasks/tasksSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
} from "../../types/task.types";

interface TasksState {
  allTasks: Task[];
  myTasks: Task[];
  unassignedTasks: Task[];
  
  selectedTask: Task | null;
  taskDetails: TaskDetails | null;
  loading: boolean;
  error: string | null;
  activeTab: "all" | "my"|"unassigned";
  filters: TaskFilterDto;
}

const initialState: TasksState = {
  allTasks: [],
  myTasks: [],
   unassignedTasks: [],
  taskDetails: null,
  selectedTask: null,
  loading: false,
  error: null,
  activeTab: "all",
  filters: {},
};

export interface TaskUser {
  id: number;
  email: string;
  fullName: string;
  role: number;
  profileImage: string | null;
  createdAt: string;
}

export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TaskFile {
  id: number;
  taskId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedById: number;
  uploadedByName: string;
  uploadedAt: string;
}

export interface TaskActivityLog {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface TaskDetails {
  id: number;
  title: string;
  description: string;
  priority: number;
  status: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  projectName: string;
  assignedTo: TaskUser;
  createdBy: TaskUser;
  comments: TaskComment[];
  files: TaskFile[];
  activityLogs: TaskActivityLog[];
}

// Fetch all tasks with filters
export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (filters: TaskFilterDto = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.projectId)
        params.append("projectId", String(filters.projectId));
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.assignedToId)
        params.append("assignedToId", String(filters.assignedToId));
      if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
      if (filters.isOverdue !== undefined)
        params.append("isOverdue", String(filters.isOverdue));

      const response = await api.get(`/tasks?${params.toString()}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Fetch my tasks
export const fetchMyTasks = createAsyncThunk(
  "tasks/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/my-tasks");
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my tasks"
      );
    }
  }
);

// Fetch my tasks
export const fetchUnassignedTasks = createAsyncThunk(
  "tasks/UnassignedTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/unassigned-tasks");
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my unassigned-tasks"
      );
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (task: CreateTaskDto, { rejectWithValue }) => {
    try {
      const response = await api.post("/tasks", task);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async (task: UpdateTaskDto, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${task.id}`, task);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Update task status
// export const updateTaskStatus = createAsyncThunk(
//   "tasks/updateStatus",
//   async (
//     { id, status }: { id: number; status: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await api.put(`/tasks/${id}/status`, { status });
//       return response.data.data || response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async (
    { taskId, status }: { taskId: number; status: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/Tasks/${taskId}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Assign task
export const assignTask = createAsyncThunk(
  "tasks/assign",
  async (
    { id, assignedToId }: { id: number; assignedToId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/tasks/${id}/assign`, { assignedToId });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign task"
      );
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

// ----------------

// إضافة async thunk
export const fetchTaskDetails = createAsyncThunk(
  "tasks/fetchDetails",
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Tasks/${taskId}/details`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task details"
      );
    }
  }
);

// إضافة async thunk للتعليقات
export const addComment = createAsyncThunk(
  "tasks/addComment",
  async (
    { taskId, content }: { taskId: number; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { content });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// إضافة async thunk لرفع الملفات
export const uploadFile = createAsyncThunk(
  "tasks/uploadFile",
  async (
    { taskId, file }: { taskId: number; file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`files/task/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload file"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.myTasks = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(fetchUnassignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.unassignedTasks = action.payload;
      })
      .addCase(fetchUnassignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.allTasks.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const indexAll = state.allTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexAll !== -1) state.allTasks[indexAll] = action.payload;
        const indexMy = state.myTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexMy !== -1) state.myTasks[indexMy] = action.payload;
      })

      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const indexAll = state.allTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexAll !== -1) state.allTasks[indexAll] = action.payload;
        const indexMy = state.myTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexMy !== -1) state.myTasks[indexMy] = action.payload;
      })

      .addCase(assignTask.fulfilled, (state, action) => {
        const indexAll = state.allTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexAll !== -1) state.allTasks[indexAll] = action.payload;
        const indexMy = state.myTasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (indexMy !== -1) state.myTasks[indexMy] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.allTasks = state.allTasks.filter((t) => t.id !== action.payload);
        state.myTasks = state.myTasks.filter((t) => t.id !== action.payload);
      })
      .addCase(fetchTaskDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetails = action.payload;
      })
      .addCase(fetchTaskDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.taskDetails) {
          state.taskDetails.comments.push(action.payload);
        }
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        if (state.taskDetails) {
          state.taskDetails.files.push(action.payload);
        }
      });
  },
});

export const { clearError, setActiveTab, setFilters, clearFilters } =
  tasksSlice.actions;
export default tasksSlice.reducer;
