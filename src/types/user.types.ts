
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
   profileImage?: string | null;

}
export interface UserDto {
  id: string | number;
  email: string;
  fullName: string;        // ← تغيير من name إلى fullName
  role?: number | string;
  profileImage?: string | null;  // ← تغيير من avatar إلى profileImage
  createdAt?: string;
}

export interface UpdateProfileDto {
  name: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: number;
}
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}