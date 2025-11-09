export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date | string;
  deadline: Date | string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  createdById: string;
  createdBy?: string;
  ownerId?:number


}

export interface CreateProjectDto {
  name: string;
  description: string;
  createdAt: Date | string;
  deadline: Date | string;
  status: string;
}

export interface UpdateProjectDto extends CreateProjectDto {
  id: string;
}