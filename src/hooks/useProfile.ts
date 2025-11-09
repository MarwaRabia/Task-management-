/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProfile.ts
import { useState, useCallback } from 'react';
import api from '../services/api';
import type{ User } from '../types/user.types';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // جلب بيانات المستخدم
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/me');
      setUser(res.data.data || res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث البيانات
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put('/users/me', data);
      setUser(res.data.data || res.data);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/users/change-password', data);
      setSuccess('Password changed successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  // رفع الصورة
  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(prev => prev ? { ...prev, avatar: res.data.data.avatar } : null);
      setSuccess('Avatar uploaded');
    } catch (err: any) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    success,
    fetchUser,
    updateProfile,
    changePassword,
    uploadAvatar,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    },
  };
};