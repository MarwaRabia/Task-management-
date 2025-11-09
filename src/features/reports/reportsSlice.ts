// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

import type {
  ReportSummary,
  ProjectProgress,
  MemberPerformance,
  OverdueTasksResponse,
  DistributionItem,
} from "../../types/reports.types";

 interface ReportsState {
  summary: ReportSummary | null;
  projectsProgress: ProjectProgress[];
  memberPerformance: MemberPerformance[];
  overdueTasks: OverdueTasksResponse | null;
  statusDistribution: DistributionItem[];
  priorityDistribution: DistributionItem[];
  loading: boolean;
  error: string | null;
  filters: {
    month: number | null;
    year: number | null;
  };
}

 const initialState: ReportsState = {
  summary: null,
  projectsProgress: [],
  memberPerformance: [],
  overdueTasks: null,
  statusDistribution: [],
  priorityDistribution: [],
  loading: false,
  error: null,
  filters: {
    month: null,
    year: null,
  },
};

// Async Thunks
export const fetchReportSummary = createAsyncThunk<
  ReportSummary,
  { month?: number; year?: number }
>("reports/fetchSummary", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.year) params.append("year", filters.year.toString());

    const response = await api.get(`/Reports/summary?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch summary"
    );
  }
});

export const fetchProjectsProgress = createAsyncThunk<
  ProjectProgress[],
  { month?: number; year?: number }
>("reports/fetchProjectsProgress", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.year) params.append("year", filters.year.toString());

    const response = await api.get(
      `/Reports/projects-progress?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch projects progress"
    );
  }
});

export const fetchMemberPerformance = createAsyncThunk<
  MemberPerformance[],
  { month?: number; year?: number }
>("reports/fetchMemberPerformance", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.year) params.append("year", filters.year.toString());

    const response = await api.get(
      `/Reports/members-performance?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch member performance"
    );
  }
});

export const fetchOverdueTasks = createAsyncThunk<
  OverdueTasksResponse,
  { page?: number; pageSize?: number }
>(
  "reports/fetchOverdueTasks",
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/Reports/overdue-tasks?page=${page}&pageSize=${pageSize}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overdue tasks"
      );
    }
  }
);

export const fetchTaskStatusDistribution = createAsyncThunk<
  DistributionItem[],
  { month?: number; year?: number }
>("reports/fetchStatusDistribution", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.year) params.append("year", filters.year.toString());

    const response = await api.get(
      `/Reports/task-status-distribution?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch status distribution"
    );
  }
});

export const fetchTaskPriorityDistribution = createAsyncThunk<
  DistributionItem[],
  { month?: number; year?: number }
>("reports/fetchPriorityDistribution", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month.toString());
    if (filters.year) params.append("year", filters.year.toString());

    const response = await api.get(
      `/Reports/task-priority-distribution?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch priority distribution"
    );
  }
});

// Thunk to fetch all reports at once
export const fetchAllReports = createAsyncThunk<
  void,
  { month?: number; year?: number } | undefined
>("reports/fetchAll", async (filters = {}, { dispatch, rejectWithValue }) => {
  try {
    await Promise.all([
      dispatch(fetchReportSummary(filters)),
      dispatch(fetchProjectsProgress(filters)),
      dispatch(fetchMemberPerformance(filters)),
      dispatch(fetchOverdueTasks({ page: 1, pageSize: 10 })),
      dispatch(fetchTaskStatusDistribution(filters)),
      dispatch(fetchTaskPriorityDistribution(filters)),
    ]);
  } catch (error: any) {
    return rejectWithValue("Failed to fetch reports");
  }
});

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { month: null, year: null };
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchReportSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchReportSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Projects Progress
    builder.addCase(fetchProjectsProgress.fulfilled, (state, action) => {
      state.projectsProgress = action.payload;
    });

    // Member Performance
    builder.addCase(fetchMemberPerformance.fulfilled, (state, action) => {
      state.memberPerformance = action.payload;
    });

    // Overdue Tasks
    builder.addCase(fetchOverdueTasks.fulfilled, (state, action) => {
      state.overdueTasks = action.payload;
    });

    // Status Distribution
    builder.addCase(fetchTaskStatusDistribution.fulfilled, (state, action) => {
      state.statusDistribution = action.payload;
    });

    // Priority Distribution
    builder.addCase(
      fetchTaskPriorityDistribution.fulfilled,
      (state, action) => {
        state.priorityDistribution = action.payload;
      }
    );
  },
});

export const { setFilters, clearFilters } = reportsSlice.actions;
export default reportsSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import api from "../../services/api";

// // Interfaces
// export interface ReportSummary {
//   totalProjects: number;
//   activeProjects: number;
//   totalTasks: number;
//   completedTasks: number;
//   overdueTasks: number;
//   completionRate: number;
// }

// export interface ProjectProgress {
//   projectId: number;
//   projectName: string;
//   totalTasks: number;
//   completedTasks: number;
//   percentage: number;
// }

// export interface MemberPerformance {
//   userId: number;
//   fullName: string;
//   totalTasks: number;
//   completedTasks: number;
//   rate: number;
// }

// export interface OverdueTask {
//   id: number;
//   title: string;
//   projectName: string;
//   assignedTo: string;
//   dueDate: string;
//   daysOverdue: number;
// }

// export interface OverdueTasksResponse {
//   items: OverdueTask[];
//   pagination: {
//     total: number;
//     page: number;
//     pageSize: number;
//     totalPages: number;
//     hasPrevious: boolean;
//     hasNext: boolean;
//   };
// }

// export interface DistributionItem {
//   label: string;
//   value: number;
// }

// export interface ReportsState {
//   summary: ReportSummary | null;
//   projectsProgress: ProjectProgress[];
//   memberPerformance: MemberPerformance[];
//   overdueTasks: OverdueTasksResponse | null;
//   statusDistribution: DistributionItem[];
//   priorityDistribution: DistributionItem[];
//   loading: boolean;
//   error: string | null;
//   filters: {
//     month: number | null;
//     year: number | null;
//   };
// }

// const initialState: ReportsState = {
//   summary: null,
//   projectsProgress: [],
//   memberPerformance: [],
//   overdueTasks: null,
//   statusDistribution: [],
//   priorityDistribution: [],
//   loading: false,
//   error: null,
//   filters: {
//     month: null,
//     year: null,
//   },
// };

// // Async Thunks
// export const fetchReportSummary = createAsyncThunk(
//   "reports/fetchSummary",
//   async (filters: { month?: number; year?: number }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (filters.month) params.append("month", filters.month.toString());
//       if (filters.year) params.append("year", filters.year.toString());

//       const response = await api.get(
//         `/Reports/summary?${params.toString()}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch summary"
//       );
//     }
//   }
// );

// export const fetchProjectsProgress = createAsyncThunk(
//   "reports/fetchProjectsProgress",
//   async (filters: { month?: number; year?: number }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (filters.month) params.append("month", filters.month.toString());
//       if (filters.year) params.append("year", filters.year.toString());

//       const response = await api.get(
//         `/Reports/projects-progress?${params.toString()}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch projects progress"
//       );
//     }
//   }
// );

// export const fetchMemberPerformance = createAsyncThunk(
//   "reports/fetchMemberPerformance",
//   async (filters: { month?: number; year?: number }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (filters.month) params.append("month", filters.month.toString());
//       if (filters.year) params.append("year", filters.year.toString());

//       const response = await api.get(
//         `/Reports/members-performance?${params.toString()}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch member performance"
//       );
//     }
//   }
// );

// export const fetchOverdueTasks = createAsyncThunk(
//   "reports/fetchOverdueTasks",
//   async (
//     { page = 1, pageSize = 10 }: { page?: number; pageSize?: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await api.get(
//         `/Reports/overdue-tasks?page=${page}&pageSize=${pageSize}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch overdue tasks"
//       );
//     }
//   }
// );

// export const fetchTaskStatusDistribution = createAsyncThunk(
//   "reports/fetchStatusDistribution",
//   async (filters: { month?: number; year?: number }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (filters.month) params.append("month", filters.month.toString());
//       if (filters.year) params.append("year", filters.year.toString());

//       const response = await api.get(
//         `/Reports/task-status-distribution?${params.toString()}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch status distribution"
//       );
//     }
//   }
// );

// export const fetchTaskPriorityDistribution = createAsyncThunk(
//   "reports/fetchPriorityDistribution",
//   async (filters: { month?: number; year?: number }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (filters.month) params.append("month", filters.month.toString());
//       if (filters.year) params.append("year", filters.year.toString());

//       const response = await api.get(
//         `/Reports/task-priority-distribution?${params.toString()}`
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch priority distribution"
//       );
//     }
//   }
// );

// // Thunk to fetch all reports at once
// export const fetchAllReports = createAsyncThunk(
//   "reports/fetchAll",
//   async (
//     filters: { month?: number; year?: number } = {},
//     { dispatch, rejectWithValue }
//   ) => {
//     try {
//       await Promise.all([
//         dispatch(fetchReportSummary(filters)),
//         dispatch(fetchProjectsProgress(filters)),
//         dispatch(fetchMemberPerformance(filters)),
//         dispatch(fetchOverdueTasks({ page: 1, pageSize: 10 })),
//         dispatch(fetchTaskStatusDistribution(filters)),
//         dispatch(fetchTaskPriorityDistribution(filters)),
//       ]);
//     } catch (error: any) {
//       return rejectWithValue("Failed to fetch reports");
//     }
//   }
// );

// const reportsSlice = createSlice({
//   name: "reports",
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = action.payload;
//     },
//     clearFilters: (state) => {
//       state.filters = { month: null, year: null };
//     },
//   },
//   extraReducers: (builder) => {
//     // Summary
//     builder
//       .addCase(fetchReportSummary.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchReportSummary.fulfilled, (state, action) => {
//         state.loading = false;
//         state.summary = action.payload;
//       })
//       .addCase(fetchReportSummary.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // Projects Progress
//     builder
//       .addCase(fetchProjectsProgress.fulfilled, (state, action) => {
//         state.projectsProgress = action.payload;
//       });

//     // Member Performance
//     builder
//       .addCase(fetchMemberPerformance.fulfilled, (state, action) => {
//         state.memberPerformance = action.payload;
//       });

//     // Overdue Tasks
//     builder
//       .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
//         state.overdueTasks = action.payload;
//       });

//     // Status Distribution
//     builder
//       .addCase(fetchTaskStatusDistribution.fulfilled, (state, action) => {
//         state.statusDistribution = action.payload;
//       });

//     // Priority Distribution
//     builder
//       .addCase(fetchTaskPriorityDistribution.fulfilled, (state, action) => {
//         state.priorityDistribution = action.payload;
//       });
//   },
// });

// export const { setFilters, clearFilters } = reportsSlice.actions;
// export default reportsSlice.reducer;
