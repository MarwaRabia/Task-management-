/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { TabPanel, Item } from "devextreme-react/tab-panel";
import {
  Form,
  SimpleItem,
  Label,
  RequiredRule,
  EmailRule,
  CompareRule,
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import api from "../../../services/api";
import notify from "devextreme/ui/notify";
import { setUser } from "../../../features/auth/authSlice";
import "./UserProfile.css";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "", // إضافة
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ROLE_NAMES: { [key: number]: string } = {
    1: "Admin",
    2: "Team Leader",
    3: "Member",
  };

  const getRoleName = (roleValue: string | number | undefined): string => {
    if (roleValue === undefined || roleValue === null) return "";
    const roleNumber = Number(roleValue);
    return ROLE_NAMES[roleNumber] || String(roleValue);
  };

  // Helper function to build full image URL
  const getFullImageUrl = (
    imagePath: string | null | undefined
  ): string | null => {
    if (!imagePath) return null;

    // If already full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;

    // Build full URL from relative path
    const baseUrl =
      api.defaults.baseURL?.replace("/api", "") || "http://localhost:5163";
      console.log("`${baseUrl}${imagePath}`",`${baseUrl}${imagePath}`)
    return `${baseUrl}${imagePath}`;
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.data || response.data;
      const roleName = getRoleName(userData.role);

      setProfileData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: roleName || "",
        profileImage: userData.profileImage || "", // حفظ المسار
      });
    } catch (error) {
      console.error("Failed to load profile", error);
      // Fallback to Redux state
      if (user) {
        const roleName = getRoleName(user.role);
        setProfileData({
          fullName: user.name || "",
          email: user.email || "",
          phone: "",
          role: roleName || "",
          profileImage: user.profileImage || "",
        });
      }
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      notify("Only JPG, PNG, and GIF files are allowed", "error", 2000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("File size must be less than 5MB", "error", 2000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImagePath = response.data?.data?.profileImage;

      if (newImagePath) {
        // تحديث الـ state المحلي
        setProfileData((prev) => ({
          ...prev,
          profileImage: newImagePath,
        }));

        // تحديث Redux state
        if (user) {
          dispatch(
            setUser({
              ...user,
              profileImage: newImagePath,
            })
          );
        }

        // تحديث localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.profileImage = newImagePath;
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        notify("Avatar uploaded successfully", "success", 2000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to upload avatar";
      notify(msg, "error", 3000);
    } finally {
      setLoading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData.fullName || !profileData.email) {
      notify("Please fill all required fields", "warning", 2000);
      return;
    }

    setLoading(true);
    try {
      const updatePayload = {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
      };

      await api.put("/users/me", updatePayload);

      notify("Profile updated successfully", "success", 2000);

      // Update Redux state
      if (user) {
        dispatch(
          setUser({
            ...user,

            name: profileData.fullName,
            email: profileData.email,
          })
        );

        // Update localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.fullName = profileData.fullName;
          userObj.name = profileData.fullName;
          userObj.email = profileData.email;
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      notify(errorMessage, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      notify("Please fill all password fields", "warning", 2000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify("New passwords do not match", "error", 2000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      notify("Password must be at least 6 characters", "warning", 2000);
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      notify("Password changed successfully", "success", 2000);

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      notify(errorMessage, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 0,
      text: "Profile Information",
      icon: "user",
    },
    {
      id: 1,
      text: "Change Password",
      icon: "key",
    },
    {
      id: 2,
      text: "Account Settings",
      icon: "preferences",
    },
  ];

  // Get full image URL for display
  const avatarUrl = getFullImageUrl(profileData.profileImage);

  const profileInformationTemplate = (
    <div className="profile-tab">
      <LoadPanel visible={loading} />
      <div className="profile-header">
        <div className="profile-avatar">
          <div
            className="avatar-circle"
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer", position: "relative" }}
            title="Click to upload avatar"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML =
                    profileData.fullName
                      ? profileData.fullName.charAt(0).toUpperCase()
                      : "U";
                }}
              />
            ) : profileData.fullName ? (
              profileData.fullName.charAt(0).toUpperCase()
            ) : (
              "U"
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />

            <div className="avatar-overlay">
              <i className="dx-icon-upload"></i>
              <span>Upload</span>
            </div>
          </div>

          <div className="avatar-info">
            <h3>{profileData.fullName}</h3>
            <p>{profileData.email}</p>
            <span className="role-badge">{profileData.role}</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Personal Information</h4>

        <Form
          formData={profileData}
          labelLocation="top"
          showColonAfterLabel={false}
          onFieldDataChanged={(e: any) =>
            setProfileData((prev) => ({ ...prev, [e.dataField]: e.value }))
          }
        >
          <SimpleItem dataField="fullName" editorType="dxTextBox">
            <Label text="Full Name" />
            <RequiredRule message="Name is required" />
          </SimpleItem>

          <SimpleItem dataField="email" editorType="dxTextBox">
            <Label text="Email Address" />
            <RequiredRule message="Email is required" />
            <EmailRule message="Invalid email format" />
          </SimpleItem>

          <SimpleItem
            dataField="role"
            editorType="dxTextBox"
            editorOptions={{ readOnly: true }}
          >
            <Label text="Role" />
          </SimpleItem>
        </Form>

        <div className="form-actions">
          <Button
            text="Cancel"
            onClick={loadUserProfile}
            stylingMode="outlined"
          />
          <Button
            text="Save Changes"
            type="default"
            onClick={handleUpdateProfile}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  const changePasswordTemplate = (
    <div className="profile-tab">
      <LoadPanel visible={loading} />

      <div className="form-section">
        <h4>Change Your Password</h4>
        <p className="form-description">
          Ensure your account is using a strong password to stay secure.
        </p>

        <Form
          formData={passwordData}
          labelLocation="top"
          showColonAfterLabel={false}
          onFieldDataChanged={(e: any) =>
            setPasswordData((prev) => ({
              ...prev,
              [e.dataField]: e.value,
            }))
          }
        >
          <SimpleItem
            dataField="currentPassword"
            editorType="dxTextBox"
            editorOptions={{ mode: "password" }}
          >
            <Label text="Current Password" />
            <RequiredRule message="Current password is required" />
          </SimpleItem>

          <SimpleItem
            dataField="newPassword"
            editorType="dxTextBox"
            editorOptions={{ mode: "password" }}
          >
            <Label text="New Password" />
            <RequiredRule message="New password is required" />
          </SimpleItem>

          <SimpleItem
            dataField="confirmPassword"
            editorType="dxTextBox"
            editorOptions={{ mode: "password" }}
          >
            <Label text="Confirm New Password" />
            <RequiredRule message="Please confirm your password" />
            <CompareRule
              message="Passwords do not match"
              comparisonTarget={() => passwordData.newPassword}
            />
          </SimpleItem>
        </Form>

        <div className="password-requirements">
          <p>Password must:</p>
          <ul>
            <li>Be at least 6 characters long</li>
            <li>Not be the same as your current password</li>
          </ul>
        </div>

        <div className="form-actions">
          <Button
            text="Cancel"
            onClick={() =>
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
            }
            stylingMode="outlined"
          />
          <Button
            text="Update Password"
            type="default"
            onClick={handleChangePassword}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  const accountSettingsTemplate = (
    <div className="profile-tab">
      <div className="form-section">
        <h4>Account Information</h4>

        <div className="info-grid">
          <div className="info-item">
            <label>Account Status</label>
            <span className="status-badge status-active">Active</span>
          </div>

          <div className="info-item">
            <label>Member Since</label>
            <span>January 2024</span>
          </div>

          <div className="info-item">
            <label>Email Verified</label>
            <span className="verified">✓ Verified</span>
          </div>

          <div className="info-item">
            <label>Two-Factor Authentication</label>
            <span className="not-enabled">Not Enabled</span>
          </div>
        </div>

        <div className="danger-zone">
          <h4>Danger Zone</h4>
          <p>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            text="Delete Account"
            type="danger"
            stylingMode="outlined"
            onClick={() => notify("Feature coming soon", "info", 2000)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-profile-container">
      <div className="profile-header-title">
        <h1>Profile Settings</h1>
        <p className="page-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="profile-content">
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
            {profileInformationTemplate}
          </Item>
          <Item title={tabs[1].text} icon={tabs[1].icon}>
            {changePasswordTemplate}
          </Item>
          <Item title={tabs[2].text} icon={tabs[2].icon}>
            {accountSettingsTemplate}
          </Item>
        </TabPanel>
      </div>
    </div>
  );
};

export default UserProfile;
