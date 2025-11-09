export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName?: string;
  assignedToId: number;
  assignedToName?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date | string;
  isOverdue?: boolean;
  createdAt?: Date | string;
  createdById?: number;
  createdByName?: string;
}

export interface TaskFilterDto {
  projectId?: number;
  status?: string;
  priority?: string;
  assignedToId?: number;
  searchTerm?: string;
  isOverdue?: boolean;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  projectId: number;
  assignedToId: number;
  status: number;
  priority: number;
  dueDate: Date | string;
}

export interface UpdateTaskDto extends CreateTaskDto {
  id: number;
}