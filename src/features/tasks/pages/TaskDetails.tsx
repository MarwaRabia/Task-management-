
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import {
//   fetchTaskDetails,
//   addComment,
//   uploadFile,
//   updateTaskStatus,
// } from "../tasksSlice";
// import { LoadPanel } from "devextreme-react/load-panel";
// import { Button } from "devextreme-react/button";
// import { ProgressBar } from "devextreme-react/progress-bar";
// import { SelectBox } from "devextreme-react/select-box";
// import { TextArea } from "devextreme-react/text-area";
// import notify from "devextreme/ui/notify";
// import { confirm } from "devextreme/ui/dialog";
// import {
//   getPriorityLabel,
//   getPriorityColor,
//   getStatusLabel,
//   getStatusColor,
//   getRoleLabel,
//   formatDate,
//   formatDateTime,
//   getTimeAgo,
//   formatFileSize,
//   isOverdue,
//   calculateProgress,
//   STATUS_LABELS,
// } from "../../../utils/taskUtils";
// import "./TaskDetails.css";

// const TaskDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { taskDetails, loading } = useAppSelector((state) => state.tasks);
//   const { user: currentUser } = useAppSelector((state) => state.auth);

//   const [commentText, setCommentText] = useState("");
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [isUploadingFile, setIsUploadingFile] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // الحل النهائي: استخدم ref + flag
//   const currentStatusRef = useRef<number | null>(null);
//   const isStatusUpdatingRef = useRef(false); // منع التكرار أثناء التحديث

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchTaskDetails(Number(id)));
//     }
//   }, [dispatch, id]);

//   // تحديث currentStatusRef عند جلب التاسك
//   useEffect(() => {
//     if (taskDetails) {
//       currentStatusRef.current = taskDetails.status;
//     }
//   }, [taskDetails?.status]);

//   const handleStatusChange = async (newStatus: number) => {
//     // منع التنفيذ إذا كان التحديث جاري أو القيمة ما اتغيرتش
//     if (
//       !taskDetails ||
//       newStatus === currentStatusRef.current ||
//       isStatusUpdatingRef.current
//     ) {
//       return;
//     }

//     const result = await confirm(
//       `Change task status to "${getStatusLabel(newStatus)}"?`,
//       "Confirm Status Change"
//     );

//     if (result) {
//       isStatusUpdatingRef.current = true; // بدأ التحديث

//       try {
//         await dispatch(
//           updateTaskStatus({ taskId: taskDetails.id, status: newStatus })
//         ).unwrap();

//         notify("Status updated successfully", "success", 2000);
//         currentStatusRef.current = newStatus;

//         // إعادة جلب التفاصيل
//         await dispatch(fetchTaskDetails(taskDetails.id)).unwrap();
//       } catch (error: any) {
//         const errorMessage =
//           error?.response?.data?.message ||
//           error?.message ||
//           "Failed to update status";
//         notify(errorMessage, "error", 3000);
//       } finally {
//         isStatusUpdatingRef.current = false; // انتهى التحديث
//       }
//     }
//   };

//   const handleAddComment = async () => {
//     if (!commentText.trim() || !taskDetails) {
//       notify("Please enter a comment", "warning", 2000);
//       return;
//     }

//     setIsSubmittingComment(true);
//     try {
//       await dispatch(
//         addComment({ taskId: taskDetails.id, content: commentText })
//       ).unwrap();
//       setCommentText("");
//       notify("Comment added successfully", "success", 2000);
//     } catch (error: any) {
//       notify(error || "Failed to add comment", "error", 2000);
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file || !taskDetails) return;

//     if (file.size > 10 * 1024 * 1024) {
//       notify("File size must be less than 10MB", "error", 2000);
//       return;
//     }

//     setIsUploadingFile(true);
//     try {
//       await dispatch(uploadFile({ taskId: taskDetails.id, file })).unwrap();
//       notify("File uploaded successfully", "success", 2000);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (error: any) {
//       notify(error || "Failed to upload file", "error", 2000);
//     } finally {
//       setIsUploadingFile(false);
//     }
//   };

//   const handleDownloadFile = (fileId: number, fileName: string) => {
//     window.open(`http://localhost:5163/api/files/${fileId}/download`, "_blank");
//   };

//   if (loading && !taskDetails) {
//     return <LoadPanel visible={true} />;
//   }

//   if (!taskDetails) {
//     return (
//       <div className="task-details-container">
//         <div className="error-message">Task not found</div>
//       </div>
//     );
//   }

//   const progress = calculateProgress(taskDetails.status);
//   const overdueStatus = isOverdue(taskDetails.dueDate, taskDetails.status);

//   const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
//     value: Number(value),
//     text: label,
//   }));

//   return (
//     <div className="task-details-container">
//       <LoadPanel visible={loading} />

//       {/* Header */}
//       <div className="task-details-header">
//         <Button
//           icon="back"
//           text="Back to Tasks"
//           onClick={() => navigate(-1)}
//           stylingMode="text"
//         />
//         <div className="header-actions">
//           <Button
//             icon="edit"
//             text="Edit"
//             onClick={() => navigate(`/tasks/${taskDetails.id}/edit`)}
//             stylingMode="outlined"
//           />
//           <Button
//             icon="refresh"
//             hint="Refresh"
//             onClick={() => dispatch(fetchTaskDetails(taskDetails.id))}
//             stylingMode="text"
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="task-details-content">
//         {/* Left Column */}
//         <div className="task-main-column">
//           {/* Task Header Card */}
//           <div className="task-card task-header-card">
//             <div className="task-id">#{taskDetails.id}</div>
//             <h1 className="task-title">{taskDetails.title}</h1>

//             <div className="task-badges">
//               <span
//                 className="task-status-badge"
//                 style={{ backgroundColor: getStatusColor(taskDetails.status) }}
//               >
//                 {getStatusLabel(taskDetails.status)}
//               </span>
//               <span
//                 className="task-priority-badge"
//                 style={{
//                   backgroundColor: getPriorityColor(taskDetails.priority),
//                 }}
//               >
//                 {getPriorityLabel(taskDetails.priority)}
//               </span>
//               {overdueStatus && (
//                 <span className="task-overdue-badge">
//                   <i className="dx-icon-warning"></i>
//                   Overdue
//                 </span>
//               )}
//             </div>

//             <div className="task-project-link">
//               <i className="dx-icon-folder"></i>
//               <a href={`/projects/${taskDetails.projectId}`}>
//                 {taskDetails.projectName}
//               </a>
//             </div>
//           </div>

//           {/* Progress Card */}
//           <div className="task-card">
//             <h3 className="card-title">Progress</h3>
//             <div className="progress-section">
//               <div className="progress-header">
//                 <span className="progress-label">
//                   {getStatusLabel(taskDetails.status)}
//                 </span>
//                 <span className="progress-percentage">{progress}%</span>
//               </div>
//               <ProgressBar
//                 min={0}
//                 max={100}
//                 value={progress}
//                 statusFormat={() => ""}
//               />
//             </div>
//           </div>

//           {/* Description Card */}
//           <div className="task-card">
//             <h3 className="card-title">Description</h3>
//             <div className="task-description">
//               {taskDetails.description || "No description provided"}
//             </div>
//           </div>

//           {/* Files Card */}
//           <div className="task-card">
//             <div className="card-header">
//               <h3 className="card-title">
//                 Files & Attachments ({taskDetails.files.length})
//               </h3>
//               <Button
//                 icon="upload"
//                 text="Upload"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={isUploadingFile}
//                 stylingMode="outlined"
//               />
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 style={{ display: "none" }}
//                 onChange={handleFileUpload}
//               />
//             </div>

//             {taskDetails.files.length > 0 ? (
//               <div className="files-list">
//                 {taskDetails.files.map((file) => (
//                   <div key={file.id} className="file-item">
//                     <div className="file-icon">
//                       <i className="dx-icon-file"></i>
//                     </div>
//                     <div className="file-info">
//                       <div className="file-name">{file.fileName}</div>
//                       <div className="file-meta">
//                         {formatFileSize(file.fileSize)} • Uploaded by{" "}
//                         {file.uploadedByName} • {getTimeAgo(file.uploadedAt)}
//                       </div>
//                     </div>
//                     <Button
//                       icon="download"
//                       hint="Download"
//                       onClick={() => handleDownloadFile(file.id, file.fileName)}
//                       stylingMode="text"
//                     />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="empty-state">
//                 <i className="dx-icon-file"></i>
//                 <p>No files attached yet</p>
//               </div>
//             )}
//           </div>

//           {/* Comments Card */}
//           <div className="task-card">
//             <h3 className="card-title">
//               Comments ({taskDetails.comments.length})
//             </h3>

//             {/* Add Comment */}
//             <div className="add-comment-section">
//               <div className="comment-avatar">
//                 {currentUser?.name?.charAt(0).toUpperCase() || "U"}
//               </div>
//               <div className="comment-input-wrapper">
//                 <TextArea
//                   value={commentText}
//                   onValueChanged={(e) => setCommentText(e.value)}
//                   placeholder="Write a comment..."
//                   height={80}
//                 />
//                 <div className="comment-actions">
//                   <Button
//                     text="Comment"
//                     type="default"
//                     onClick={handleAddComment}
//                     disabled={isSubmittingComment || !commentText.trim()}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Comments List */}
//             {taskDetails.comments.length > 0 ? (
//               <div className="comments-list">
//                 {taskDetails.comments.map((comment) => (
//                   <div key={comment.id} className="comment-item">
//                     <div className="comment-avatar">
//                       {comment.userName.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="comment-content">
//                       <div className="comment-header">
//                         <span className="comment-author">
//                           {comment.userName}
//                         </span>
//                         <span className="comment-time">
//                           {getTimeAgo(comment.createdAt)}
//                         </span>
//                       </div>
//                       <div className="comment-text">{comment.content}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="empty-state">
//                 <i className="dx-icon-comment"></i>
//                 <p>No comments yet. Be the first to comment!</p>
//               </div>
//             )}
//           </div>

//           {/* Activity Log Card */}
//           {taskDetails.activityLogs.length > 0 && (
//             <div className="task-card">
//               <h3 className="card-title">Activity Log</h3>
//               <div className="activity-list">
//                 {taskDetails.activityLogs.map((log) => (
//                   <div key={log.id} className="activity-item">
//                     <div className="activity-icon">
//                       <i className="dx-icon-clock"></i>
//                     </div>
//                     <div className="activity-content">
//                       <div className="activity-text">
//                         <strong>{log.userName}</strong> {log.action}
//                       </div>
//                       {log.details && (
//                         <div className="activity-details">{log.details}</div>
//                       )}
//                       <div className="activity-time">
//                         {getTimeAgo(log.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Sidebar */}
//         <div className="task-sidebar">
//           {/* Quick Actions Card */}
//           <div className="task-card">
//             <h3 className="card-title">Quick Actions</h3>
//             <div className="quick-actions">
//               <div className="action-item">
//                 <label>Change Status</label>
//                 <SelectBox
//                   items={statusOptions}
//                   value={currentStatusRef.current ?? taskDetails.status}
//                   valueExpr="value"
//                   displayExpr="text"
//                   onValueChanged={(e) => handleStatusChange(e.value)}
//                 />
//               </div>
//             </div>
//           </div>

//          <div className="task-card">
//              <h3 className="card-title">Details</h3>
//             <div className="details-list">
//               <div className="detail-item">
//                 <span className="detail-label">Assigned To</span>
//                 <div className="detail-value user-detail">
//                   <div className="user-avatar-small">
//                     {taskDetails.assignedTo.fullName.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div className="user-name-small">
//                       {taskDetails.assignedTo.fullName}
//                     </div>
//                     <div className="user-email-small">
//                       {taskDetails.assignedTo.email}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Created By</span>
//                 <div className="detail-value user-detail">
//                   <div className="user-avatar-small">
//                     {taskDetails.createdBy.fullName.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <div className="user-name-small">
//                       {taskDetails.createdBy.fullName}
//                     </div>
//                     <div className="user-email-small">
//                       {getRoleLabel(taskDetails.createdBy.role)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Created</span>
//                 <span className="detail-value">
//                   {formatDateTime(taskDetails.createdAt)}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Last Updated</span>
//                 <span className="detail-value">
//                   {formatDateTime(taskDetails.updatedAt)}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Due Date</span>
//                 <span
//                   className={`detail-value ${
//                     overdueStatus ? "overdue-text" : ""
//                   }`}
//                 >
//                   {formatDate(taskDetails.dueDate)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Card */}
//           <div className="task-card">
//             <h3 className="card-title">Statistics</h3>
//             <div className="stats-list">
//               <div className="stat-item">
//                 <i className="dx-icon-comment"></i>
//                 <span>{taskDetails.comments.length} Comments</span>
//               </div>
//               <div className="stat-item">
//                 <i className="dx-icon-file"></i>
//                 <span>{taskDetails.files.length} Files</span>
//               </div>
//               <div className="stat-item">
//                 <i className="dx-icon-clock"></i>
//                 <span>
//                   {Math.ceil(
//                     (new Date(taskDetails.dueDate).getTime() -
//                       new Date().getTime()) /
//                       (1000 * 60 * 60 * 24)
//                   )}{" "}
//                   days left
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskDetails;


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchTaskDetails,
  addComment,
  uploadFile,
  updateTaskStatus,
} from "../tasksSlice";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import { ProgressBar } from "devextreme-react/progress-bar";
import { SelectBox } from "devextreme-react/select-box";
import { TextArea } from "devextreme-react/text-area";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import api from "../../../services/api";
import { fetchProjects } from "../../projects/projectsSlice";

import {
  getPriorityLabel,
  getPriorityColor,
  getStatusLabel,
  getStatusColor,
  getRoleLabel,
  formatDate,
  formatDateTime,
  getTimeAgo,
  formatFileSize,
  isOverdue,
  calculateProgress,
  STATUS_LABELS,
} from "../../../utils/taskUtils";
import "./TaskDetails.css";

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { taskDetails, loading } = useAppSelector((state) => state.tasks);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const currentStatusRef = useRef<number | null>(null);
  const isStatusUpdatingRef = useRef(false);
  //  const { projectDetails } = useAppSelector((state) => state.projects);

  const { projects } = useAppSelector(
    (state) => state.projects
  );
 

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskDetails(Number(id)));
      dispatch(fetchProjects())
      // dispatch(fetchProjectDetails(taskDetails.projectId));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (taskDetails) {
      currentStatusRef.current = taskDetails.status;
    }
  }, [taskDetails?.status]);


  const handleStatusChange = async (newStatus: number) => {
    if (
      !taskDetails ||
      newStatus === currentStatusRef.current ||
      isStatusUpdatingRef.current
    ) {
      return;
    }

    const result = await confirm(
      `Change task status to "${getStatusLabel(newStatus)}"?`,
      "Confirm Status Change"
    );

    if (result) {
      isStatusUpdatingRef.current = true;

      try {
        await dispatch(
          updateTaskStatus({ taskId: taskDetails.id, status: newStatus })
        ).unwrap();

        notify("Status updated successfully", "success", 2000);
        currentStatusRef.current = newStatus;

        await dispatch(fetchTaskDetails(taskDetails.id)).unwrap();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update status";
        notify(errorMessage, "error", 3000);
      } finally {
        isStatusUpdatingRef.current = false;
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !taskDetails) {
      notify("Please enter a comment", "warning", 2000);
      return;
    }

    setIsSubmittingComment(true);
    try {
      await dispatch(
        addComment({ taskId: taskDetails.id, content: commentText })
      ).unwrap();
      setCommentText("");
      notify("Comment added successfully", "success", 2000);
    } catch (error: any) {
      notify(error || "Failed to add comment", "error", 2000);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentContent);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentText.trim() || !taskDetails) {
      notify("Comment cannot be empty", "warning", 2000);
      return;
    }

    try {
      await api.put(`/tasks/${taskDetails.id}/comments/${commentId}`, {
        content: editCommentText,
      });

      notify("Comment updated successfully", "success", 2000);
      setEditingCommentId(null);
      setEditCommentText("");
      
      // Refresh task details to show updated comment
      dispatch(fetchTaskDetails(taskDetails.id));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update comment";
      notify(errorMessage, "error", 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!taskDetails) return;

    const result = await confirm(
      "Are you sure you want to delete this comment?",
      "Confirm Delete"
    );

    if (result) {
      try {
        await api.delete(`/tasks/${taskDetails.id}/comments/${commentId}`);
        
        notify("Comment deleted successfully", "success", 2000);
        
        // Refresh task details to remove deleted comment
        dispatch(fetchTaskDetails(taskDetails.id));
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete comment";
        notify(errorMessage, "error", 3000);
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !taskDetails) return;

    if (file.size > 10 * 1024 * 1024) {
      notify("File size must be less than 10MB", "error", 2000);
      return;
    }

    setIsUploadingFile(true);
    try {
      await dispatch(uploadFile({ taskId: taskDetails.id, file })).unwrap();
      notify("File uploaded successfully", "success", 2000);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      notify(error || "Failed to upload file", "error", 2000);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // const handleDownloadFile = (fileId: number, fileName: string) => {
  //   window.open(`http://localhost:5163/api/files/${fileId}/download`);
  // };


  const handleDownloadFile = async (fileId: number, fileName: string) => {
    try {
      // Get the token from localStorage or your auth state
      const token = localStorage.getItem('token'); // Adjust based on where you store your token
      
      // Use fetch with authorization header
      const response = await fetch(`http://localhost:5163/api/files/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      notify("File downloaded successfully", "success", 2000);
    } catch (error: any) {
      notify("Failed to download file", "error", 2000);
      console.error('Download error:', error);
    }
  };


   const handleDeleteFile = async (fileId: number, fileName: string) => {
    if (!taskDetails) return;

    const result = await confirm(
      `Are you sure you want to delete "${fileName}"?`,
      "Confirm Delete"
    );

    if (result) {
      try {
        await api.delete(`/files/${fileId}`);
        
        notify("File deleted successfully", "success", 2000);
        
        // Refresh task details to remove deleted file
        dispatch(fetchTaskDetails(taskDetails.id));
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete file";
        notify(errorMessage, "error", 3000);
      }
    }
  };

  if (loading && !taskDetails) {
    return <LoadPanel visible={true} />;
  }

  if (!taskDetails) {
    return (
      <div className="task-details-container">
        <div className="error-message">Task not found</div>
      </div>
    );
  }

  const progress = calculateProgress(taskDetails.status);
  const overdueStatus = isOverdue(taskDetails.dueDate, taskDetails.status);

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value: Number(value),
    text: label,
  }));

  const projectOwner =projects.find((p)=>Number(p.id)===taskDetails.projectId)
  // console.log("projectOwner",projectOwner)

  
 

  // console.log("Details",taskDetails.projectId , Number(currentUser?.id),projectOwner?.ownerId,projectOwner?.createdById)

  return (
    <div className="task-details-container">
      <LoadPanel visible={loading} />

      {/* Header */}
      <div className="task-details-header">
        <Button
          icon="back"
          text="Back to Tasks"
          onClick={() => navigate(-1)}
          stylingMode="text"
        />
        <div className="header-actions">
          <Button
            icon="edit"
            text="Edit"
            onClick={() => navigate(`/tasks/${taskDetails.id}/edit`)}
            stylingMode="outlined"
          />
          <Button
            icon="refresh"
            hint="Refresh"
            onClick={() => dispatch(fetchTaskDetails(taskDetails.id))}
            stylingMode="text"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="task-details-content">
        {/* Left Column */}
        <div className="task-main-column">
          {/* Task Header Card */}
          <div className="task-card task-header-card">
            <div className="task-id">#{taskDetails.id}</div>
            <h1 className="task-title">{taskDetails.title}</h1>

            <div className="task-badges">
              <span
                className="task-status-badge"
                style={{ backgroundColor: getStatusColor(taskDetails.status) }}
              >
                {getStatusLabel(taskDetails.status)}
              </span>
              <span
                className="task-priority-badge"
                style={{
                  backgroundColor: getPriorityColor(taskDetails.priority),
                }}
              >
                {getPriorityLabel(taskDetails.priority)}
              </span>
              {overdueStatus && (
                <span className="task-overdue-badge">
                  <i className="dx-icon-warning"></i>
                  Overdue
                </span>
              )}
            </div>

            <div className="task-project-link">
              <i className="dx-icon-folder"></i>
              <a href={`/projects/${taskDetails.projectId}`}>
                {taskDetails.projectName}
              </a>
            </div>
          </div>

          {/* Progress Card */}
          <div className="task-card">
            <h3 className="card-title">Progress</h3>
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">
                  {getStatusLabel(taskDetails.status)}
                </span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <ProgressBar
                min={0}
                max={100}
                value={progress}
                statusFormat={() => ""}
              />
            </div>
          </div>

          {/* Description Card */}
          <div className="task-card">
            <h3 className="card-title">Description</h3>
            <div className="task-description">
              {taskDetails.description || "No description provided"}
            </div>
          </div>

          {/* Files Card */}
          <div className="task-card">
            <div className="card-header">
              <h3 className="card-title">
                Files & Attachments ({taskDetails.files.length})
              </h3>
              <Button
                icon="upload"
                text="Upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                stylingMode="outlined"
              />
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>

            {taskDetails.files.length > 0 ? (
              <div className="files-list">
                {taskDetails.files.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-icon">
                      <i className="dx-icon-file"></i>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.fileName}</div>
                      <div className="file-meta">
                        {formatFileSize(file.fileSize)} • Uploaded by{" "}
                        {file.uploadedByName} • {getTimeAgo(file.uploadedAt)}
                      </div>
                    </div>
                    <Button
                      icon="download"
                      hint="Download"
                      onClick={() => handleDownloadFile(file.id, file.fileName)}
                      stylingMode="text"
                    />



{/* Show delete button for file uploader or project owner */}
                      {(file.uploadedById === Number(currentUser?.id) || projectOwner?.ownerId === Number(currentUser?.id)) && (
                        <Button
                          icon="trash"
                          hint="Delete"
                          onClick={() => handleDeleteFile(file.id, file.fileName)}
                          stylingMode="text"
                          type="danger"
                        />
                      )}


                    
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="dx-icon-file"></i>
                <p>No files attached yet</p>
              </div>
            )}
          </div>

          {/* Comments Card */}
          <div className="task-card">
            <h3 className="card-title">
              Comments ({taskDetails.comments.length})
            </h3>

            {/* Add Comment */}
            <div className="add-comment-section">
              <div className="comment-avatar">
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="comment-input-wrapper">
                <TextArea
                  value={commentText}
                  onValueChanged={(e) => setCommentText(e.value)}
                  placeholder="Write a comment..."
                  height={80}
                />
                <div className="comment-actions">
                  <Button
                    text="Comment"
                    type="default"
                    onClick={handleAddComment}
                    disabled={isSubmittingComment || !commentText.trim()}
                  />
                </div>
              </div>
            </div>

            {/* Comments List */}
            {taskDetails.comments.length > 0 ? (
              <div className="comments-list">
                {taskDetails.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.userName}
                        </span>
                        <span className="comment-time">
                          {getTimeAgo(comment.createdAt)}
                        </span>


                    

                     
                           {/* Show edit button only for comment owner, delete for owner or project owner */}
                        {(comment.userId === Number(currentUser?.id) || projectOwner?.ownerId === Number(currentUser?.id)) && (
                          <div className="comment-actions-buttons">
                            {/* Edit button only for comment owner */}
                            {comment.userId === Number(currentUser?.id) && (
                              <Button
                                icon="edit"
                                hint="Edit"
                                onClick={() => handleEditComment(comment.id, comment.content)}
                                stylingMode="text"
                              />
                            )}
                            {/* Delete button for comment owner OR project owner */}
                            <Button
                              icon="trash"
                              hint="Delete"
                              onClick={() => handleDeleteComment(comment.id)}
                              stylingMode="text"
                              type="danger"
                            />
                          </div>
                        )}
                       
                       

                      </div>
                      
                      {/* Show text area if editing, otherwise show comment text */}
                      {editingCommentId === comment.id ? (
                        <div className="edit-comment-section">
                          <TextArea
                            value={editCommentText}
                            onValueChanged={(e) => setEditCommentText(e.value)}
                            height={80}
                          />
                          <div className="edit-comment-actions">
                            <Button
                              text="Cancel"
                              onClick={handleCancelEdit}
                              stylingMode="outlined"
                            />
                            <Button
                              text="Update"
                              type="default"
                              onClick={() => handleUpdateComment(comment.id)}
                              disabled={!editCommentText.trim()}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="comment-text">{comment.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="dx-icon-comment"></i>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Activity Log Card */}
          {taskDetails.activityLogs.length > 0 && (
            <div className="task-card">
              <h3 className="card-title">Activity Log</h3>
              <div className="activity-list">
                {taskDetails.activityLogs.map((log) => (
                  <div key={log.id} className="activity-item">
                    <div className="activity-icon">
                      <i className="dx-icon-clock"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{log.userName}</strong> {log.action}
                      </div>
                      {log.details && (
                        <div className="activity-details">{log.details}</div>
                      )}
                      <div className="activity-time">
                        {getTimeAgo(log.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="task-sidebar">
          {/* Quick Actions Card */}
          <div className="task-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <div className="action-item">
                <label>Change Status</label>
                <SelectBox
                  items={statusOptions}
                  value={currentStatusRef.current ?? taskDetails.status}
                  valueExpr="value"
                  displayExpr="text"
                  onValueChanged={(e) => handleStatusChange(e.value)}
                />
              </div>
            </div>
          </div>

          <div className="task-card">
            <h3 className="card-title">Details</h3>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Assigned To</span>
                <div className="detail-value user-detail">
                  <div className="user-avatar-small">
                    {taskDetails.assignedTo.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name-small">
                      {taskDetails.assignedTo.fullName}
                    </div>
                    <div className="user-email-small">
                      {taskDetails.assignedTo.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created By</span>
                <div className="detail-value user-detail">
                  <div className="user-avatar-small">
                    {taskDetails.createdBy.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name-small">
                      {taskDetails.createdBy.fullName}
                    </div>
                    <div className="user-email-small">
                      {getRoleLabel(taskDetails.createdBy.role)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">
                  {formatDateTime(taskDetails.createdAt)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">
                  {formatDateTime(taskDetails.updatedAt)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date</span>
                <span
                  className={`detail-value ${
                    overdueStatus ? "overdue-text" : ""
                  }`}
                >
                  {formatDate(taskDetails.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="task-card">
            <h3 className="card-title">Statistics</h3>
            <div className="stats-list">
              <div className="stat-item">
                <i className="dx-icon-comment"></i>
                <span>{taskDetails.comments.length} Comments</span>
              </div>
              <div className="stat-item">
                <i className="dx-icon-file"></i>
                <span>{taskDetails.files.length} Files</span>
              </div>
              <div className="stat-item">
                <i className="dx-icon-clock"></i>
                <span>
                  {Math.ceil(
                    (new Date(taskDetails.dueDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;