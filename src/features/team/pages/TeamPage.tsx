// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { useState, useEffect } from "react";
// // import {
// //   DataGrid,
// //   Column,
// //   Paging,
// //   Pager,
// //   SearchPanel,
// // } from "devextreme-react/data-grid";
// // import { Button } from "devextreme-react/button";
// // import { Popup } from "devextreme-react/popup";
// // import {
// //   Form,
// //   SimpleItem,
// //   Label,
// //   RequiredRule,
// //   EmailRule,
// // } from "devextreme-react/form";
// // import { LoadPanel } from "devextreme-react/load-panel";
// // import { useAppSelector } from "../../../app/hooks";
// // import api from "../../../services/api";
// // import notify from "devextreme/ui/notify";
// // import { confirm } from "devextreme/ui/dialog";
// // import "./TeamPage.css";

// // interface User {
// //   id: number;
// //   fullName: string;
// //   email: string;
// //   role: number;
// //   phone?: string;
// //   projectsCount?: number;
// //   tasksCount?: number;
// //   createdAt?: string;
// // }

// // const TeamPage = () => {
// //   const { user: currentUser } = useAppSelector((state) => state.auth);
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [showAddUserPopup, setShowAddUserPopup] = useState(false);
// //   const [showEditUserPopup, setShowEditUserPopup] = useState(false);
// //   const [selectedUser, setSelectedUser] = useState<User | null>(null);

// //   const [formData, setFormData] = useState({
// //     fullName: "",
// //     email: "",
// //     password: "",
// //     role: 3,
// //     phone: "",
// //   });
// // //   console.log("useers",  users[0].role);

// //   const ROLE_NAMES: { [key: number]: string } = {
// //     1: "Admin",
// //     2: "Team Leader",
// //     3: "Member",
// //   };
// //   const getRoleName = (roleValue: string | number | undefined): string => {
// //     if (roleValue === undefined || roleValue === null) return "";
// //     const roleNumber = Number(roleValue);
// //     return ROLE_NAMES[roleNumber] || String(roleValue);
// //   };
// //   const roleName = getRoleName(currentUser?.role);
// //   console.log(roleName);

// //   const isAdmin = roleName === "Admin" || roleName === "admin";
// //   console.log(currentUser?.role);
// //   console.log("isAdmin", isAdmin);

// //   useEffect(() => {
// //     loadUsers();
// //   }, []);

// //   const loadUsers = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await api.get("/users");
// //       const usersData = response.data.data || response.data;

// //       setUsers(usersData);
// //     } catch (error) {
// //       console.error("Failed to load users", error);
// //       notify("Failed to load team members", "error", 2000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAddUser = () => {
// //     setFormData({
// //       fullName: "",
// //       email: "",
// //       password: "",
// //       role: 3,
// //       phone: "",
// //     });
// //     setShowAddUserPopup(true);
// //   };

// //   const handleEditUser = (user: User) => {
// //     setSelectedUser(user);
// //     setFormData({
// //       fullName: user.fullName,
// //       email: user.email,
// //       password: "",
// //       role: user.role,
// //       phone: user.phone || "",
// //     });
// //     setShowEditUserPopup(true);
// //   };

// //   const handleDeleteUser = async (userId: number) => {
// //     const result = await confirm(
// //       "Are you sure you want to delete this user?",
// //       "Confirm Delete"
// //     );

// //     if (result) {
// //       setLoading(true);
// //       try {
// //         await api.delete(`/users/${userId}`);
// //         notify("User deleted successfully", "success", 2000);
// //         loadUsers();
// //       } catch (error: any) {
// //         notify(
// //           error.response?.data?.message || "Failed to delete user",
// //           "error",
// //           2000
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const handleSubmitAddUser = async () => {
// //     if (!formData.fullName || !formData.email || !formData.password) {
// //       notify("Please fill all required fields", "warning", 2000);
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await api.post("/auth/register", {
// //         name: formData.fullName,
// //         email: formData.email,
// //         password: formData.password,
// //         role: formData.role,
// //         phone: formData.phone,
// //       });

// //       notify("User added successfully", "success", 2000);
// //       setShowAddUserPopup(false);
// //       loadUsers();
// //     } catch (error: any) {
// //       notify(
// //         error.response?.data?.message || "Failed to add user",
// //         "error",
// //         2000
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmitEditUser = async () => {
// //     if (!formData.fullName || !formData.email || !selectedUser) {
// //       notify("Please fill all required fields", "warning", 2000);
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await api.put(`/users/${selectedUser.id}`, {
// //         name: formData.fullName,
// //         email: formData.email,
// //         role: formData.role,
// //         phone: formData.phone,
// //       });

// //       notify("User updated successfully", "success", 2000);
// //       setShowEditUserPopup(false);
// //       loadUsers();
// //     } catch (error: any) {
// //       notify(
// //         error.response?.data?.message || "Failed to update user",
// //         "error",
// //         2000
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getRoleBadge = (role: string) => {
// //     const roleClasses: Record<string, string> = {
// //       Admin: "role-admin",
// //       Manager: "role-manager",
// //       User: "role-user",
// //       Member: "role-user",
// //     };

// //     return (
// //       <span className={`role-badge ${roleClasses[role] || "role-user"}`}>
// //         {role}
// //       </span>
// //     );
// //   };

// //   const renderRoleCell = (data: any) => {
// //     return getRoleBadge(data.value);
// //   };

// //   const renderActionsCell = (data: any) => {
// //     if (!isAdmin) return null;

// //     const isCurrentUser = data.data.id === currentUser?.id;

// //     return (
// //       <div className="action-buttons">
// //         <Button
// //           icon="edit"
// //           hint="Edit"
// //           onClick={() => handleEditUser(data.data)}
// //           stylingMode="text"
// //         />
// //         {!isCurrentUser && (
// //           <Button
// //             icon="trash"
// //             hint="Delete"
// //             onClick={() => handleDeleteUser(data.data.id)}
// //             stylingMode="text"
// //             type="danger"
// //           />
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderNameCell = (data: any) => {
// //     return (
// //       <div className="user-cell">
// //         {/* <div className="user-avatar">
// //           {data.value.charAt(0).toUpperCase()}
// //           </div> */}
// //         <div className="user-info">
// //           <span className="user-name">{data.value}</span>
// //           {data.data.id === currentUser?.id && (
// //             <span className="current-user-badge">You</span>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// // //   const roleOptions = ["Admin", "Manager", "User"];
// //   const roleOptions = [
// //     { value: 1, label: 'Admin' },
// //     { value: 2, label: 'TeamLeader' },
// //     { value: 3, label: 'Member' }
// //   ];

// //   return (
// //     <div className="team-page-container">
// //       <LoadPanel visible={loading} />

// //       {/* Header */}
// //       <div className="team-header">
// //         <div>
// //           <h1>Team Members</h1>
// //           <p className="page-subtitle">
// //             {isAdmin
// //               ? "Manage your team members and their permissions"
// //               : "View team members and their contact information"}
// //           </p>
// //         </div>
// //         {isAdmin && (
// //           <Button
// //             text="Add Member"
// //             icon="plus"
// //             type="default"
// //             onClick={handleAddUser}
// //           />
// //         )}
// //       </div>

// //       {/* Statistics Cards */}
// //       <div className="team-stats">
// //         <div className="stat-card">
// //           <div className="stat-icon">
// //             <i className="dx-icon-group"></i>
// //           </div>
// //           <div className="stat-content">
// //             <h3>{users.length}</h3>
// //             <p>Total Members</p>
// //           </div>
// //         </div>

// //         <div className="stat-card">
// //           <div className="stat-icon stat-admin">
// //             <i className="dx-icon-user"></i>
// //           </div>
// //           <div className="stat-content">
// //             <h3>{users.filter((u) => u.role == 1).length}</h3>
// //             <p>Administrators</p>
// //           </div>
// //         </div>

// //         <div className="stat-card">
// //           <div className="stat-icon stat-active">
// //             <i className="dx-icon-check"></i>
// //           </div>
// //           <div className="stat-content">
// //             <h3>{users.length}</h3>
// //             <p>Active Users</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Team Grid */}
// //       <div className="team-grid-container">
// //         <DataGrid
// //           dataSource={users}
// //           keyExpr="id"
// //           showBorders={true}
// //           showRowLines={true}
// //           showColumnLines={false}
// //           rowAlternationEnabled={true}
// //           columnAutoWidth={true}
// //           hoverStateEnabled={true}
// //         >
// //           <SearchPanel
// //             visible={true}
// //             width={240}
// //             placeholder="Search team members..."
// //           />
// //           <Paging defaultPageSize={15} />
// //           <Pager
// //             visible={true}
// //             showPageSizeSelector={true}
// //             allowedPageSizes={[10, 15, 25, 50]}
// //             showInfo={true}
// //           />

// //           <Column
// //             dataField="fullName"
// //             caption="Name"
// //             width={250}
// //             cellRender={renderNameCell}
// //           />
// //           <Column dataField="email" caption="Email" width={250} />
// //           <Column dataField="phone" caption="Phone" width={150} />
// //           <Column
// //             dataField="role"
// //             caption="Role"
// //             width={120}
// //    calculateDisplayValue={(rowData: User) => getRoleName(rowData.role)} // هام للفرز/البحث

// //             cellRender={renderRoleCell}
// //           />
// //           {isAdmin && (
// //             <Column
// //               caption="Actions"
// //               width={100}
// //               cellRender={renderActionsCell}
// //               allowFiltering={false}
// //               allowSorting={false}
// //             />
// //           )}
// //         </DataGrid>
// //       </div>

// //       {/* Add User Popup */}
// //       <Popup
// //         visible={showAddUserPopup}
// //         onHiding={() => setShowAddUserPopup(false)}
// //         dragEnabled={false}
// //         hideOnOutsideClick={true}
// //         showTitle={true}
// //         title="Add New Team Member"
// //         width={600}
// //         height="auto"
// //       >
// //         <div className="user-form">
// //           <Form
// //             formData={formData}
// //             labelLocation="top"
// //             showColonAfterLabel={false}
// //           >
// //             <SimpleItem dataField="name" editorType="dxTextBox">
// //               <Label text="Full Name" />
// //               <RequiredRule message="Name is required" />
// //             </SimpleItem>

// //             <SimpleItem dataField="email" editorType="dxTextBox">
// //               <Label text="Email Address" />
// //               <RequiredRule message="Email is required" />
// //               <EmailRule message="Invalid email format" />
// //             </SimpleItem>

// //             <SimpleItem
// //               dataField="password"
// //               editorType="dxTextBox"
// //               editorOptions={{ mode: "password" }}
// //             >
// //               <Label text="Password" />
// //               <RequiredRule message="Password is required" />
// //             </SimpleItem>

// //             <SimpleItem dataField="phone" editorType="dxTextBox">
// //               <Label text="Phone Number" />
// //             </SimpleItem>

// //             <SimpleItem
// //               dataField="role"
// //               editorType="dxSelectBox"
// //               editorOptions={{
// //                 items: roleOptions,
// //                 searchEnabled: false,
// //               }}
// //             >
// //               <Label text="Role" />
// //               <RequiredRule message="Role is required" />
// //             </SimpleItem>
// //           </Form>

// //           <div className="form-buttons">
// //             <Button
// //               text="Cancel"
// //               onClick={() => setShowAddUserPopup(false)}
// //               disabled={loading}
// //             />
// //             <Button
// //               text="Add Member"
// //               type="default"
// //               onClick={handleSubmitAddUser}
// //               disabled={loading}
// //             />
// //           </div>
// //         </div>
// //       </Popup>

// //       {/* Edit User Popup */}
// //       <Popup
// //         visible={showEditUserPopup}
// //         onHiding={() => setShowEditUserPopup(false)}
// //         dragEnabled={false}
// //         hideOnOutsideClick={true}
// //         showTitle={true}
// //         title="Edit Team Member"
// //         width={600}
// //         height="auto"
// //       >
// //         <div className="user-form">
// //           <Form
// //             formData={formData}
// //             labelLocation="top"
// //             showColonAfterLabel={false}
// //           >
// //             <SimpleItem dataField="name" editorType="dxTextBox">
// //               <Label text="Full Name" />
// //               <RequiredRule message="Name is required" />
// //             </SimpleItem>

// //             <SimpleItem dataField="email" editorType="dxTextBox">
// //               <Label text="Email Address" />
// //               <RequiredRule message="Email is required" />
// //               <EmailRule message="Invalid email format" />
// //             </SimpleItem>

// //             <SimpleItem dataField="phone" editorType="dxTextBox">
// //               <Label text="Phone Number" />
// //             </SimpleItem>

// //             <SimpleItem
// //               dataField="role"
// //               editorType="dxSelectBox"
// //               editorOptions={{
// //                 items: roleOptions,
// //                 searchEnabled: false,
// //               }}
// //             >
// //               <Label text="Role" />
// //               <RequiredRule message="Role is required" />
// //             </SimpleItem>
// //           </Form>

// //           <div className="form-buttons">
// //             <Button
// //               text="Cancel"
// //               onClick={() => setShowEditUserPopup(false)}
// //               disabled={loading}
// //             />
// //             <Button
// //               text="Update"
// //               type="default"
// //               onClick={handleSubmitEditUser}
// //               disabled={loading}
// //             />
// //           </div>
// //         </div>
// //       </Popup>
// //     </div>
// //   );
// // };

// // export default TeamPage;
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import {
//   DataGrid,
//   Column,
//   Paging,
//   Pager,
//   SearchPanel,
// } from "devextreme-react/data-grid";
// import { Button } from "devextreme-react/button";
// import { Popup } from "devextreme-react/popup";
// import {
//   Form,
//   SimpleItem,
//   Label,
//   RequiredRule,
//   EmailRule,
// } from "devextreme-react/form";
// import { LoadPanel } from "devextreme-react/load-panel";
// import { useAppSelector } from "../../../app/hooks";
// import api from "../../../services/api";
// import notify from "devextreme/ui/notify";
// import { confirm } from "devextreme/ui/dialog";
// import "./TeamPage.css";

// interface User {
//   id: number;
//   fullName: string;
//   email: string;
//   role: number;
//   phone?: string;
//   projectsCount?: number;
//   tasksCount?: number;
//   createdAt?: string;
// }

// const TeamPage = () => {
//   const { user: currentUser } = useAppSelector((state) => state.auth);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddUserPopup, setShowAddUserPopup] = useState(false);
//   const [showEditUserPopup, setShowEditUserPopup] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     role: 3,
//     phone: "",
//   });

//   // قائمة الأدوار
//   const ROLE_NAMES: { [key: number]: string } = {
//     1: "Admin",
//     2: "Team Leader",
//     3: "Member",
//   };

//   const getRoleName = (roleValue: number | string | undefined): string => {
//     if (roleValue === undefined || roleValue === null) return "Unknown";
//     const roleNumber = Number(roleValue);
//     return ROLE_NAMES[roleNumber] || `Role ${roleValue}`;
//   };

//   const roleName = getRoleName(currentUser?.role);
// //   console.log("fffffff",roleName);
//   const isAdmin = roleName === "Admin" || roleName === "admin";
//   console.log(isAdmin)

//   // تحديد إذا كان المستخدم Admin (بناءً على الرقم)
// //   const isAdmin = currentUser?.role === 1;

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/users");
//       const usersData = response.data.data || response.data;
//       setUsers(usersData);
//     } catch (error) {
//       console.error("Failed to load users", error);
//       notify("Failed to load team members", "error", 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddUser = () => {
//     setFormData({
//       fullName: "",
//       email: "",
//       password: "",
//       role: 3,
//       phone: "",
//     });
//     setShowAddUserPopup(true);
//   };

//   const handleEditUser = (user: User) => {
//     setSelectedUser(user);
//     setFormData({
//       fullName: user.fullName,
//       email: user.email,
//       password: "",
//       role: user.role,
//       phone: user.phone || "",
//     });
//     setShowEditUserPopup(true);
//   };

//   const handleDeleteUser = async (userId: number) => {
//     const result = await confirm(
//       "Are you sure you want to delete this user?",
//       "Confirm Delete"
//     );

//     if (result) {
//       setLoading(true);
//       try {
//         await api.delete(`/users/${userId}`);
//         notify("User deleted successfully", "success", 2000);
//         loadUsers();
//       } catch (error: any) {
//         notify(
//           error.response?.data?.message || "Failed to delete user",
//           "error",
//           2000
//         );
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleSubmitAddUser = async () => {
//     if (!formData.fullName || !formData.email || !formData.password) {
//       notify("Please fill all required fields", "warning", 2000);
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/register", {
//         name: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         phone: formData.phone,
//       });

//       notify("User added successfully", "success", 2000);
//       setShowAddUserPopup(false);
//       loadUsers();
//     } catch (error: any) {
//       notify(
//         error.response?.data?.message || "Failed to add user",
//         "error",
//         2000
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitEditUser = async () => {
//     if (!formData.fullName || !formData.email || !selectedUser) {
//       notify("Please fill all required fields", "warning", 2000);
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.put(`/users/${selectedUser.id}`, {
//         name: formData.fullName,
//         email: formData.email,
//         role: formData.role,
//         phone: formData.phone,
//       });

//       notify("User updated successfully", "success", 2000);
//       setShowEditUserPopup(false);
//       loadUsers();
//     } catch (error: any) {
//       notify(
//         error.response?.data?.message || "Failed to update user",
//         "error",
//         2000
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // بطاقة الدور (Badge)
//   const getRoleBadge = (roleName: string) => {
//     const roleClasses: Record<string, string> = {
//       "Admin": "role-admin",
//       "Team Leader": "role-leader",
//       "Member": "role-member",
//     };

//     const className = roleClasses[roleName] || "role-member";

//     return (
//       <span className={`role-badge ${className}`}>
//         {roleName}
//       </span>
//     );
//   };

//   const renderRoleCell = (data: any) => {
//     return getRoleBadge(getRoleName(data.value));
//   };

//   const renderActionsCell = (data: any) => {
//     if (!isAdmin) return null;

//     const isCurrentUser = data.data.id === currentUser?.id;

//     return (
//       <div className="action-buttons">
//         <Button
//           icon="edit"
//           hint="Edit"
//           onClick={() => handleEditUser(data.data)}
//           stylingMode="text"
//         />
//         {!isCurrentUser && (
//           <Button
//             icon="trash"
//             hint="Delete"
//             onClick={() => handleDeleteUser(data.data.id)}
//             stylingMode="text"
//             type="danger"
//           />
//         )}
//       </div>
//     );
//   };

//   const renderNameCell = (data: any) => {
//     return (
//       <div className="user-cell">
//         <div className="user-info">
//           <span className="user-name">{data.value}</span>
//           {data.data.id === currentUser?.id && (
//             <span className="current-user-badge">You</span>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // خيارات الـ SelectBox
//   const roleOptions = [
//     { value: 1, text: "Admin" },
//     { value: 2, text: "Team Leader" },
//     { value: 3, text: "Member" },
//   ];

//   return (
//     <div className="team-page-container">
//       <LoadPanel visible={loading} />

//       {/* Header */}
//       <div className="team-header">
//         <div>
//           <h1>Team Members</h1>
//           <p className="page-subtitle">
//             {isAdmin
//               ? "Manage your team members and their permissions"
//               : "View team members and their contact information"}
//           </p>
//         </div>
//         {isAdmin && (
//           <Button
//             text="Add Member"
//             icon="plus"
//             type="default"
//             onClick={handleAddUser}
//           />
//         )}
//       </div>

//       {/* Statistics Cards */}
//       <div className="team-stats">
//         <div className="stat-card">
//           <div className="stat-icon">
//             <i className="dx-icon-group"></i>
//           </div>
//           <div className="stat-content">
//             <h3>{users.length}</h3>
//             <p>Total Members</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon stat-admin">
//             <i className="dx-icon-user"></i>
//           </div>
//           <div className="stat-content">
//             <h3>{users.filter((u) => u.role === 1).length}</h3>
//             <p>Admins</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon stat-leader">
//             <i className="dx-icon-check"></i>
//           </div>
//           <div className="stat-content">
//             <h3>{users.filter((u) => u.role === 2).length}</h3>
//             <p>Team Leaders</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon stat-member">
//             <i className="dx-icon-user"></i>
//           </div>
//           <div className="stat-content">
//             <h3>{users.filter((u) => u.role === 3).length}</h3>
//             <p>Members</p>
//           </div>
//         </div>
//       </div>

//       {/* Team Grid */}
//       <div className="team-grid-container">
//         <DataGrid
//           dataSource={users}
//           keyExpr="id"
//           showBorders={true}
//           showRowLines={true}
//           showColumnLines={false}
//           rowAlternationEnabled={true}
//           columnAutoWidth={true}
//           hoverStateEnabled={true}
//         >
//           <SearchPanel
//             visible={true}
//             width={240}
//             placeholder="Search team members..."
//           />
//           <Paging defaultPageSize={15} />
//           <Pager
//             visible={true}
//             showPageSizeSelector={true}
//             allowedPageSizes={[10, 15, 25, 50]}
//             showInfo={true}
//           />

//           <Column
//             dataField="fullName"
//             caption="Name"
//             width={250}
//             cellRender={renderNameCell}
//           />
//           <Column dataField="email" caption="Email" width={250} />
//           <Column dataField="phone" caption="Phone" width={150} />
//           <Column
//             dataField="role"
//             caption="Role"
//             width={120}
//             calculateDisplayValue={(rowData: User) => getRoleName(rowData.role)}
//             cellRender={renderRoleCell}
//           />
//           {isAdmin && (
//             <Column
//               caption="Actions"
//               width={100}
//               cellRender={renderActionsCell}
//               allowFiltering={false}
//               allowSorting={false}
//             />
//           )}
//         </DataGrid>
//       </div>

//       {/* Add User Popup */}
//       <Popup
//         visible={showAddUserPopup}
//         onHiding={() => setShowAddUserPopup(false)}
//         dragEnabled={false}
//         hideOnOutsideClick={true}
//         showTitle={true}
//         title="Add New Team Member"
//         width={600}
//         height="auto"
//       >
//         <div className="user-form">
//           <Form
//             formData={formData}
//             labelLocation="top"
//             showColonAfterLabel={false}
//           >
//             <SimpleItem dataField="fullName" editorType="dxTextBox">
//               <Label text="Full Name" />
//               <RequiredRule message="Name is required" />
//             </SimpleItem>

//             <SimpleItem dataField="email" editorType="dxTextBox">
//               <Label text="Email Address" />
//               <RequiredRule message="Email is required" />
//               <EmailRule message="Invalid email format" />
//             </SimpleItem>

//             <SimpleItem
//               dataField="password"
//               editorType="dxTextBox"
//               editorOptions={{ mode: "password" }}
//             >
//               <Label text="Password" />
//               <RequiredRule message="Password is required" />
//             </SimpleItem>

//             <SimpleItem dataField="phone" editorType="dxTextBox">
//               <Label text="Phone Number" />
//             </SimpleItem>

//             <SimpleItem
//               dataField="role"
//               editorType="dxSelectBox"
//               editorOptions={{
//                 items: roleOptions,
//                 valueExpr: "value",
//                 displayExpr: "text",
//                 searchEnabled: false,
//               }}
//             >
//               <Label text="Role" />
//               <RequiredRule message="Role is required" />
//             </SimpleItem>
//           </Form>

//           <div className="form-buttons">
//             <Button
//               text="Cancel"
//               onClick={() => setShowAddUserPopup(false)}
//               disabled={loading}
//             />
//             <Button
//               text="Add Member"
//               type="default"
//               onClick={handleSubmitAddUser}
//               disabled={loading}
//             />
//           </div>
//         </div>
//       </Popup>

//       {/* Edit User Popup */}
//       <Popup
//         visible={showEditUserPopup}
//         onHiding={() => setShowEditUserPopup(false)}
//         dragEnabled={false}
//         hideOnOutsideClick={true}
//         showTitle={true}
//         title="Edit Team Member"
//         width={600}
//         height="auto"
//       >
//         <div className="user-form">
//           <Form
//             formData={formData}
//             labelLocation="top"
//             showColonAfterLabel={false}
//           >
//             <SimpleItem dataField="fullName" editorType="dxTextBox">
//               <Label text="Full Name" />
//               <RequiredRule message="Name is required" />
//             </SimpleItem>

//             <SimpleItem dataField="email" editorType="dxTextBox">
//               <Label text="Email Address" />
//               <RequiredRule message="Email is required" />
//               <EmailRule message="Invalid email format" />
//             </SimpleItem>

//             <SimpleItem dataField="phone" editorType="dxTextBox">
//               <Label text="Phone Number" />
//             </SimpleItem>

//             <SimpleItem
//               dataField="role"
//               editorType="dxSelectBox"
//               editorOptions={{
//                 items: roleOptions,
//                 valueExpr: "value",
//                 displayExpr: "text",
//                 searchEnabled: false,
//               }}
//             >
//               <Label text="Role" />
//               <RequiredRule message="Role is required" />
//             </SimpleItem>
//           </Form>

//           <div className="form-buttons">
//             <Button
//               text="Cancel"
//               onClick={() => setShowEditUserPopup(false)}
//               disabled={loading}
//             />
//             <Button
//               text="Update"
//               type="default"
//               onClick={handleSubmitEditUser}
//               disabled={loading}
//             />
//           </div>
//         </div>
//       </Popup>
//     </div>
//   );
// };

// export default TeamPage;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  Column,
  Paging,
  Pager,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import {
  Form,
  SimpleItem,
  Label,
  RequiredRule,
  EmailRule,
} from "devextreme-react/form";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAppSelector } from "../../../app/hooks";
import api from "../../../services/api";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import "./TeamPage.css";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: number;
  phone?: string;
  projectsCount?: number;
  profileImage?: string;
  tasksCount?: number;
  createdAt?: string;
}

// Build full avatar URL

const TeamPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: 3,
    phone: "",
  });

  const ROLE_NAMES: { [key: number]: string } = {
    1: "Admin",
    2: "Team Leader",
    3: "Member",
  };

  const getRoleName = (roleValue: number | string | undefined): string => {
    if (roleValue === undefined || roleValue === null) return "Unknown";
    const roleNumber = Number(roleValue);
    return ROLE_NAMES[roleNumber] || `Role ${roleValue}`;
  };

  const roleName = getRoleName(currentUser?.role);
  const isAdmin = roleName === "Admin" || roleName === "admin";

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      const usersData = response.data.data || response.data;
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load users", error);
      notify("Failed to load team members", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: 3,
      phone: "",
    });
    setShowAddUserPopup(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
    });
    setShowEditUserPopup(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const result = await confirm(
      "Are you sure you want to delete this user?",
      "Confirm Delete"
    );

    if (result) {
      setLoading(true);
      try {
        await api.delete(`/users/${userId}`);
        notify("User deleted successfully", "success", 2000);
        loadUsers();
      } catch (error: any) {
        notify(
          error.response?.data?.message || "Failed to delete user",
          "error",
          2000
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewProfile = useCallback(
    (userId: number) => {
      navigate(`/team/${userId}`);
    },
    [navigate]
  );

  const handleSubmitAddUser = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      notify("Please fill all required fields", "warning", 2000);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      });

      notify("User added successfully", "success", 2000);
      setShowAddUserPopup(false);
      loadUsers();
    } catch (error: any) {
      notify(
        error.response?.data?.message || "Failed to add user",
        "error",
        2000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEditUser = async () => {
    if (!formData.fullName || !formData.email || !selectedUser) {
      notify("Please fill all required fields", "warning", 2000);
      return;
    }

    setLoading(true);
    try {
      await api.put(`/users/${selectedUser.id}`, {
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
      });

      notify("User updated successfully", "success", 2000);
      setShowEditUserPopup(false);
      loadUsers();
    } catch (error: any) {
      notify(
        error.response?.data?.message || "Failed to update user",
        "error",
        2000
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (roleName: string) => {
    const roleClasses: Record<string, string> = {
      Admin: "role-admin",
      "Team Leader": "role-leader",
      Member: "role-member",
    };

    const className = roleClasses[roleName] || "role-member";

    return <span className={`role-badge ${className}`}>{roleName}</span>;
  };

  const renderRoleCell = (data: any) => {
    return getRoleBadge(getRoleName(data.value));
  };

  const renderActionsCell = (data: any) => {
    const isCurrentUser = data.data.id === currentUser?.id;

    return (
      <div className="action-buttons">
        <Button
          icon="eyeopen"
          hint="View Profile"
          onClick={() => handleViewProfile(data.data.id)}
          stylingMode="text"
        />
        {isAdmin && (
          <>
            <Button
              icon="edit"
              hint="Edit"
              onClick={() => handleEditUser(data.data)}
              stylingMode="text"
            />
            {!isCurrentUser && (
              <Button
                icon="trash"
                hint="Delete"
                onClick={() => handleDeleteUser(data.data.id)}
                stylingMode="text"
                type="danger"
              />
            )}
          </>
        )}
      </div>
    );
  };

  const renderNameCell = (data: any) => {
    return (
      <div
        className="user-cell clickable"
        onClick={() => handleViewProfile(data.data.id)}
      >
        <div className="user-avatar">
          {data.data.profileImage ? (
            <img
              src={`http://localhost:5163${data.data.profileImage}`}
              className="user-avatar-img"
            />
          ) : (
            data.value.charAt(0).toUpperCase()
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{data.value}</span>

          {data.data.id === Number(currentUser?.id) && (
            <span className="current-user-badge">You</span>
          )}
        </div>
      </div>
    );
  };

  const roleOptions = [
    { value: 1, text: "Admin" },
    { value: 2, text: "Team Leader" },
    { value: 3, text: "Member" },
  ];

  return (
    <div className="team-page-container">
      <LoadPanel visible={loading} />

      <div className="team-header">
        <div>
          <h1>Team Members</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Manage your team members and their permissions"
              : "View team members and their contact information"}
          </p>
        </div>
        {isAdmin && (
          <Button
            text="Add Member"
            icon="plus"
            type="default"
            onClick={handleAddUser}
          />
        )}
      </div>

      <div className="team-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="dx-icon-group"></i>
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-admin">
            <i className="dx-icon-user"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter((u) => u.role === 1).length}</h3>
            <p>Admins</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-leader">
            <i className="dx-icon-check"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter((u) => u.role === 2).length}</h3>
            <p>Team Leaders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-member">
            <i className="dx-icon-user"></i>
          </div>
          <div className="stat-content">
            <h3>{users.filter((u) => u.role === 3).length}</h3>
            <p>Members</p>
          </div>
        </div>
      </div>

      <div className="team-grid-container">
        <DataGrid
          dataSource={users}
          keyExpr="id"
          showBorders={true}
          showRowLines={true}
          showColumnLines={false}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          hoverStateEnabled={true}
        >
          <SearchPanel
            visible={true}
            width={240}
            placeholder="Search team members..."
          />
          <Paging defaultPageSize={15} />
          <Pager
            visible={true}
            showPageSizeSelector={true}
            allowedPageSizes={[10, 15, 25, 50]}
            showInfo={true}
          />

          <Column
            dataField="fullName"
            caption="Name"
            width={250}
            cellRender={renderNameCell}
          />
          <Column dataField="email" caption="Email" width={250} />
          <Column dataField="phone" caption="Phone" width={150} />
          <Column
            dataField="role"
            caption="Role"
            width={120}
            calculateDisplayValue={(rowData: User) => getRoleName(rowData.role)}
            cellRender={renderRoleCell}
          />
          <Column
            caption="Actions"
            width={130}
            cellRender={renderActionsCell}
            allowFiltering={false}
            allowSorting={false}
          />
        </DataGrid>
      </div>

      {/* Add User Popup */}
      <Popup
        visible={showAddUserPopup}
        onHiding={() => setShowAddUserPopup(false)}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showTitle={true}
        title="Add New Team Member"
        width={600}
        height="auto"
      >
        <div className="user-form">
          <Form
            formData={formData}
            labelLocation="top"
            showColonAfterLabel={false}
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
              dataField="password"
              editorType="dxTextBox"
              editorOptions={{ mode: "password" }}
            >
              <Label text="Password" />
              <RequiredRule message="Password is required" />
            </SimpleItem>

            <SimpleItem dataField="phone" editorType="dxTextBox">
              <Label text="Phone Number" />
            </SimpleItem>

            <SimpleItem
              dataField="role"
              editorType="dxSelectBox"
              editorOptions={{
                items: roleOptions,
                valueExpr: "value",
                displayExpr: "text",
                searchEnabled: false,
              }}
            >
              <Label text="Role" />
              <RequiredRule message="Role is required" />
            </SimpleItem>
          </Form>

          <div className="form-buttons">
            <Button
              text="Cancel"
              onClick={() => setShowAddUserPopup(false)}
              disabled={loading}
            />
            <Button
              text="Add Member"
              type="default"
              onClick={handleSubmitAddUser}
              disabled={loading}
            />
          </div>
        </div>
      </Popup>

      {/* Edit User Popup */}
      <Popup
        visible={showEditUserPopup}
        onHiding={() => setShowEditUserPopup(false)}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showTitle={true}
        title="Edit Team Member"
        width={600}
        height="auto"
      >
        <div className="user-form">
          <Form
            formData={formData}
            labelLocation="top"
            showColonAfterLabel={false}
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

            <SimpleItem dataField="phone" editorType="dxTextBox">
              <Label text="Phone Number" />
            </SimpleItem>

            <SimpleItem
              dataField="role"
              editorType="dxSelectBox"
              editorOptions={{
                items: roleOptions,
                valueExpr: "value",
                displayExpr: "text",
                searchEnabled: false,
              }}
            >
              <Label text="Role" />
              <RequiredRule message="Role is required" />
            </SimpleItem>
          </Form>

          <div className="form-buttons">
            <Button
              text="Cancel"
              onClick={() => setShowEditUserPopup(false)}
              disabled={loading}
            />
            <Button
              text="Update"
              type="default"
              onClick={handleSubmitEditUser}
              disabled={loading}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default TeamPage;
