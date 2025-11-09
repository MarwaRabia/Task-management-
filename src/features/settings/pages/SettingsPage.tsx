/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { TabPanel, Item } from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import { Switch } from "devextreme-react/switch";
import { SelectBox } from "devextreme-react/select-box";
import { RadioGroup } from "devextreme-react/radio-group";
import { LoadPanel } from "devextreme-react/load-panel";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import api from "../../../services/api";
import "./SettingsPage.css";
import { useTheme } from "../../../hooks/useTheme";

interface NotificationSettings {
  emailNotifications: boolean;
  taskAssigned: boolean;
  taskUpdated: boolean;
  taskCompleted: boolean;
  projectInvites: boolean;
  comments: boolean;
  mentions: boolean;
  weeklyDigest: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  allowTaskAssignment: boolean;
  showActivity: boolean;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    taskAssigned: true,
    taskUpdated: true,
    taskCompleted: false,
    projectInvites: true,
    comments: true,
    mentions: true,
    weeklyDigest: false,
  });

  // Appearance State
  // const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const { theme, changeTheme } = useTheme();
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  // Privacy State
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "team",
    showEmail: true,
    showPhone: false,
    allowTaskAssignment: true,
    showActivity: true,
  });

  // Data Management State
  const [autoSave, setAutoSave] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Load from localStorage or API
      const savedTheme = localStorage.getItem("theme") as any;
      // if (savedTheme) setTheme(savedTheme);

      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) setLanguage(savedLanguage);

      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      const savedPrivacy = localStorage.getItem("privacy");
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Notifications Tab
  // ============================================

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications));

      // Optional: Save to backend
      // await api.put("/users/settings/notifications", notifications);

      notify("Notification preferences saved", "success", 2000);
    } catch (error) {
      notify("Failed to save preferences", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Appearance Tab
  // ============================================

  // const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);

  //   // Apply theme
  //   if (newTheme === "auto") {
  //     const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  //     document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  //   } else {
  //     document.documentElement.setAttribute("data-theme", newTheme);
  //   }

  //   notify(`Theme changed to ${newTheme}`, "success", 1500);
  // };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    changeTheme(newTheme);
    notify(`Theme changed to ${newTheme}`, "success", 1500);
  };

  const handleSaveAppearance = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("timeFormat", timeFormat);
    localStorage.setItem("compactMode", compactMode.toString());

    notify("Appearance settings saved", "success", 2000);
  };

  // ============================================
  // Privacy Tab
  // ============================================

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }));
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      localStorage.setItem("privacy", JSON.stringify(privacy));

      // Optional: Save to backend
      // await api.put("/users/settings/privacy", privacy);

      notify("Privacy settings saved", "success", 2000);
    } catch (error) {
      notify("Failed to save privacy settings", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Data Management Tab
  // ============================================

  const handleClearCache = async () => {
    const result = await confirm(
      "This will clear all cached data. Continue?",
      "Clear Cache"
    );

    if (result) {
      setLoading(true);
      try {
        // Clear specific cache items
        const keysToKeep = ["token", "user", "theme", "language"];
        const allKeys = Object.keys(localStorage);

        allKeys.forEach((key) => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });

        notify("Cache cleared successfully", "success", 2000);
      } catch (error) {
        notify("Failed to clear cache", "error", 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Create data export
      const exportData = {
        user: JSON.parse(localStorage.getItem("user") || "{}"),
        settings: {
          notifications,
          theme,
          language,
          privacy,
        },
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `settings-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notify("Settings exported successfully", "success", 2000);
    } catch (error) {
      notify("Failed to export settings", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    const result = await confirm(
      "This will reset all settings to default. Continue?",
      "Reset Settings"
    );

    if (result) {
      setLoading(true);
      try {
        // Reset to defaults
        setNotifications({
          emailNotifications: true,
          taskAssigned: true,
          taskUpdated: true,
          taskCompleted: false,
          projectInvites: true,
          comments: true,
          mentions: true,
          weeklyDigest: false,
        });

        // setTheme("light");
        setLanguage("en");
        setCompactMode(false);
        setDateFormat("MM/DD/YYYY");
        setTimeFormat("12h");

        setPrivacy({
          profileVisibility: "team",
          showEmail: true,
          showPhone: false,
          allowTaskAssignment: true,
          showActivity: true,
        });

        // Clear from localStorage
        localStorage.removeItem("notifications");
        localStorage.removeItem("privacy");
        localStorage.setItem("theme", "light");
        localStorage.setItem("language", "en");

        notify("Settings reset to default", "success", 2000);
      } catch (error) {
        notify("Failed to reset settings", "error", 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 0, text: "Notifications", icon: "bell" },
    { id: 1, text: "Appearance", icon: "palette" },
    { id: 2, text: "Privacy", icon: "lock" },
    { id: 3, text: "Data & Storage", icon: "folder" },
  ];

  const themeOptions = [
    { value: "light", text: "Light" },
    { value: "dark", text: "Dark" },
    { value: "auto", text: "Auto (System)" },
  ];

  const languageOptions = [
    { value: "en", text: "English" },
    { value: "ar", text: "العربية" },
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", text: "MM/DD/YYYY (12/31/2024)" },
    { value: "DD/MM/YYYY", text: "DD/MM/YYYY (31/12/2024)" },
    { value: "YYYY-MM-DD", text: "YYYY-MM-DD (2024-12-31)" },
  ];

  const timeFormatOptions = [
    { value: "12h", text: "12-hour (3:30 PM)" },
    { value: "24h", text: "24-hour (15:30)" },
  ];

  const visibilityOptions = [
    { value: "everyone", text: "Everyone" },
    { value: "team", text: "Team Members Only" },
    { value: "private", text: "Private" },
  ];

  // Templates
  const notificationsTemplate = (
    <div className="settings-tab">
      <LoadPanel visible={loading} />

      <div className="settings-section">
        <h3>Email Notifications</h3>
        <p className="section-description">
          Manage how you receive email notifications
        </p>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Enable Email Notifications</strong>
            <p>Receive notifications via email</p>
          </div>
          <Switch
            value={notifications.emailNotifications}
            onValueChanged={() =>
              handleNotificationToggle("emailNotifications")
            }
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Task Notifications</h3>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Task Assigned</strong>
            <p>When a task is assigned to you</p>
          </div>
          <Switch
            value={notifications.taskAssigned}
            onValueChanged={() => handleNotificationToggle("taskAssigned")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Task Updated</strong>
            <p>When someone updates a task you're watching</p>
          </div>
          <Switch
            value={notifications.taskUpdated}
            onValueChanged={() => handleNotificationToggle("taskUpdated")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Task Completed</strong>
            <p>When a task is marked as completed</p>
          </div>
          <Switch
            value={notifications.taskCompleted}
            onValueChanged={() => handleNotificationToggle("taskCompleted")}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Project & Communication</h3>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Project Invites</strong>
            <p>When you're invited to join a project</p>
          </div>
          <Switch
            value={notifications.projectInvites}
            onValueChanged={() => handleNotificationToggle("projectInvites")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Comments</strong>
            <p>When someone comments on your tasks</p>
          </div>
          <Switch
            value={notifications.comments}
            onValueChanged={() => handleNotificationToggle("comments")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Mentions</strong>
            <p>When someone mentions you in a comment</p>
          </div>
          <Switch
            value={notifications.mentions}
            onValueChanged={() => handleNotificationToggle("mentions")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Weekly Digest</strong>
            <p>Receive a weekly summary of your activities</p>
          </div>
          <Switch
            value={notifications.weeklyDigest}
            onValueChanged={() => handleNotificationToggle("weeklyDigest")}
          />
        </div>
      </div>

      <div className="settings-actions">
        <Button
          text="Save Preferences"
          type="default"
          onClick={handleSaveNotifications}
          disabled={loading}
        />
      </div>
    </div>
  );

  const appearanceTemplate = (
    <div className="settings-tab">
      <div className="settings-section">
        <h3>Theme</h3>
        <p className="section-description">Choose how the app looks</p>

        <div className="theme-selector">
          <RadioGroup
            items={themeOptions}
            value={theme}
            onValueChanged={(e) => handleThemeChange(e.value)}
            layout="horizontal"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Display Options</h3>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Compact Mode</strong>
            <p>Show more content by reducing spacing</p>
          </div>
          <Switch
            value={compactMode}
            onValueChanged={(e) => setCompactMode(e.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Language & Region</h3>

        <div className="form-group">
          <label>Language</label>
          <SelectBox
            items={languageOptions}
            value={language}
            onValueChanged={(e) => setLanguage(e.value)}
            displayExpr="text"
            valueExpr="value"
          />
        </div>

        <div className="form-group">
          <label>Date Format</label>
          <SelectBox
            items={dateFormatOptions}
            value={dateFormat}
            onValueChanged={(e) => setDateFormat(e.value)}
            displayExpr="text"
            valueExpr="value"
          />
        </div>

        <div className="form-group">
          <label>Time Format</label>
          <SelectBox
            items={timeFormatOptions}
            value={timeFormat}
            onValueChanged={(e) => setTimeFormat(e.value)}
            displayExpr="text"
            valueExpr="value"
          />
        </div>
      </div>

      <div className="settings-actions">
        <Button
          text="Save Appearance"
          type="default"
          onClick={handleSaveAppearance}
        />
      </div>
    </div>
  );

  const privacyTemplate = (
    <div className="settings-tab">
      <div className="settings-section">
        <h3>Profile Privacy</h3>

        <div className="form-group">
          <label>Profile Visibility</label>
          <SelectBox
            items={visibilityOptions}
            value={privacy.profileVisibility}
            onValueChanged={(e) =>
              setPrivacy((prev) => ({ ...prev, profileVisibility: e.value }))
            }
            displayExpr="text"
            valueExpr="value"
          />
          <p className="field-hint">Control who can see your profile</p>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Show Email Address</strong>
            <p>Display your email on your profile</p>
          </div>
          <Switch
            value={privacy.showEmail}
            onValueChanged={() => handlePrivacyToggle("showEmail")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Show Phone Number</strong>
            <p>Display your phone number on your profile</p>
          </div>
          <Switch
            value={privacy.showPhone}
            onValueChanged={() => handlePrivacyToggle("showPhone")}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Activity Privacy</h3>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Show Activity Status</strong>
            <p>Let others see when you're online</p>
          </div>
          <Switch
            value={privacy.showActivity}
            onValueChanged={() => handlePrivacyToggle("showActivity")}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Allow Task Assignment</strong>
            <p>Allow team members to assign tasks to you</p>
          </div>
          <Switch
            value={privacy.allowTaskAssignment}
            onValueChanged={() => handlePrivacyToggle("allowTaskAssignment")}
          />
        </div>
      </div>

      <div className="settings-actions">
        <Button
          text="Save Privacy Settings"
          type="default"
          onClick={handleSavePrivacy}
          disabled={loading}
        />
      </div>
    </div>
  );

  const dataManagementTemplate = (
    <div className="settings-tab">
      <div className="settings-section">
        <h3>Data Preferences</h3>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Auto-Save</strong>
            <p>Automatically save your work</p>
          </div>
          <Switch
            value={autoSave}
            onValueChanged={(e) => setAutoSave(e.value)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <strong>Enable Cache</strong>
            <p>Cache data for faster loading</p>
          </div>
          <Switch
            value={cacheEnabled}
            onValueChanged={(e) => setCacheEnabled(e.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>

        <div className="action-group">
          <div>
            <strong>Export Settings</strong>
            <p>Download a backup of your settings</p>
          </div>
          <Button
            text="Export"
            icon="download"
            onClick={handleExportData}
            stylingMode="outlined"
          />
        </div>

        <div className="action-group">
          <div>
            <strong>Clear Cache</strong>
            <p>Clear cached data to free up space</p>
          </div>
          <Button
            text="Clear Cache"
            icon="clear"
            onClick={handleClearCache}
            stylingMode="outlined"
          />
        </div>

        <div className="action-group danger">
          <div>
            <strong>Reset Settings</strong>
            <p>Reset all settings to default values</p>
          </div>
          <Button
            text="Reset All"
            icon="revert"
            onClick={handleResetSettings}
            type="danger"
            stylingMode="outlined"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="page-subtitle">
          Customize your experience and manage preferences
        </p>
      </div>

      <div className="settings-content">
        <TabPanel
          selectedIndex={activeTab}
          onSelectionChanged={(e) => setActiveTab(e.addedItems[0].id)}
          itemTitleRender={(item: any) => (
            <div className="tab-title">
              <i className={`dx-icon-${item.icon}`}></i>
              <span>{item.title}</span>
            </div>
          )}
        >
          <Item title={tabs[0].text} icon={tabs[0].icon}>
            {notificationsTemplate}
          </Item>
          <Item title={tabs[1].text} icon={tabs[1].icon}>
            {appearanceTemplate}
          </Item>
          <Item title={tabs[2].text} icon={tabs[2].icon}>
            {privacyTemplate}
          </Item>
          <Item title={tabs[3].text} icon={tabs[3].icon}>
            {dataManagementTemplate}
          </Item>
        </TabPanel>
      </div>
    </div>
  );
};

export default SettingsPage;
