// src/utils/taskUtils.ts

export const PRIORITY_LABELS: { [key: number]: string } = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export const PRIORITY_COLORS: { [key: number]: string } = {
  1: "#17a2b8", // Info/Cyan
  2: "#ffc107", // Warning/Yellow
  3: "#dc3545", // Danger/Red
};

export const STATUS_LABELS: { [key: number]: string } = {
  1: "To Do",
  2: "In Progress",
  3: "Done",
};

export const STATUS_COLORS: { [key: number]: string } = {
  1: "#6c757d", // Secondary/Gray
  2: "#007bff", // Primary/Blue
  3: "#28a745", // Success/Green
};

export const ROLE_LABELS: { [key: number]: string } = {
  1: "Admin",
  2: "Team Leader",
  3: "Member",
};

export const ROLE_COLORS: { [key: number]: string } = {
  1: "#dc3545", // Red for Admin
  2: "#007bff", // Blue for Team Leader
  3: "#28a745", // Green for Member
};

export const getPriorityLabel = (priority: number): string => {
  return PRIORITY_LABELS[priority] || `Priority ${priority}`;
};

export const getPriorityColor = (priority: number): string => {
  return PRIORITY_COLORS[priority] || "#6c757d";
};

export const getStatusLabel = (status: number): string => {
  return STATUS_LABELS[status] || `Status ${status}`;
};

export const getStatusColor = (status: number): string => {
  return STATUS_COLORS[status] || "#6c757d";
};

export const getRoleLabel = (role: number): string => {
  return ROLE_LABELS[role] || `Role ${role}`;
};

export const getRoleColor = (role: number): string => {
  return ROLE_COLORS[role] || "#6c757d";
};

export const formatDate = (date: string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeAgo = (date: string): string => {
  if (!date) return "";
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export const isOverdue = (dueDate: string, status: number): boolean => {
  if (!dueDate || status === 3) return false; // Done tasks are never overdue
  return new Date(dueDate) < new Date();
};

export const calculateProgress = (status: number): number => {
  const progressMap: { [key: number]: number } = {
    1: 0,   // To Do
    2: 50,  // In Progress
    3: 100, // Done
  };
  return progressMap[status] || 0;
};