// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useNavigate} from "react-router-dom";
// import { TreeView } from "devextreme-react/tree-view";

// interface SidebarProps {
//   collapsed: boolean;
// }

// const Sidebar = ({ collapsed }: SidebarProps) => {
//   const navigate = useNavigate();
  

//   const navigationItems = [
//     {
//       id: "1",
//       text: "Dashboard",
//       icon: "home",
//       path: "/dashboard",
//     },
//     {
//       id: "2",
//       text: "Projects",
//       icon: "folder",
//       path: "/projects",
//     },
//     {
//       id: "3",
//       text: "Tasks",
//       icon: "checklist",
//       path: "/tasks",
//     },
//     {
//       id: "4",
//       text: "Team",
//       icon: "group",
//       path: "/team",
//     },
//     {
//       id: "5",
//       text: "Reports",
//       icon: "chart",
//       path: "/reports",
//     },
//   ];

//   const handleItemClick = (e: any) => {
//     if (e.itemData.path) {
//       navigate(e.itemData.path);
//     }
//   };

//   return (
//     <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
//       <nav className="sidebar-nav">
//         <TreeView
//           items={navigationItems}
//           width="100%"
//           selectionMode="single"
//           selectByClick={true}
//           onItemClick={handleItemClick}
//           // focusStateEnabled={false}
//           activeStateEnabled={false}
//         />
//       </nav>

//       {!collapsed && (
//         <div className="sidebar-footer">
//           <p className="sidebar-version">Version 1.0.0</p>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default Sidebar;


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { TreeView } from "devextreme-react/tree-view";
import { useEffect } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void; // Add this to control sidebar from parent
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "1",
      text: "Dashboard",
      icon: "home",
      path: "/dashboard",
    },
    {
      id: "2",
      text: "Projects",
      icon: "folder",
      path: "/projects",
    },
    {
      id: "3",
      text: "Tasks",
      icon: "checklist",
      path: "/tasks",
    },
    {
      id: "4",
      text: "Team",
      icon: "group",
      path: "/team",
    },
    {
      id: "5",
      text: "Reports",
      icon: "chart",
      path: "/reports",
    },
  ];

  const handleItemClick = (e: any) => {
    if (e.itemData.path) {
      navigate(e.itemData.path);
      
      // Close sidebar on small screens after navigation
      if (window.innerWidth <= 768 && onToggle && !collapsed) {
        onToggle();
      }
    }
  };

  // Close sidebar on page reload if on small screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && onToggle && !collapsed) {
        onToggle();
      }
    };

    // Check on mount (page load/reload)
    if (window.innerWidth <= 768 && onToggle && !collapsed) {
      onToggle();
    }

    // Optional: Add resize listener to close sidebar when resizing to mobile
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run only once on mount

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <nav className="sidebar-nav">
        <TreeView
          items={navigationItems}
          width="100%"
          selectionMode="single"
          selectByClick={true}
          onItemClick={handleItemClick}
          activeStateEnabled={false}
        />
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <p className="sidebar-version">Version 1.0.0</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;