import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import type { PayloadAction} from '@reduxjs/toolkit';
import api from "../../services/api";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (unreadOnly: boolean = false) => {
    const response = await api.get(`/notifications?unreadOnly=${unreadOnly}`);
    return response.data.data;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number) => {
    await api.put(`/notifications/${id}/read`);
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await api.put('/notifications/read-all');
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: number) => {
    await api.delete(`/notifications/${id}`);
    return id;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });

    // Fetch Unread Count
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
    });

    // Mark As Read
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // Mark All As Read
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    });

    // Delete Notification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    });
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;