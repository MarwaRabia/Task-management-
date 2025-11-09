export interface ReportSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface ProjectProgress {
  projectId: number;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

export interface MemberPerformance {
  userId: number;
  fullName: string;
  totalTasks: number;
  completedTasks: number;
  rate: number;
}

export interface OverdueTask {
  id: number;
  title: string;
  projectName: string;
  assignedTo: string;
  dueDate: string;
  daysOverdue: number;
}

export interface OverdueTasksResponse {
  items: OverdueTask[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface DistributionItem {
  label: string;
  value: number;
}
