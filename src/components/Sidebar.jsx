import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToKey = {
    "/admin/dashboard": "dashboard",
    "/admin/session-list": "quiz",
    "/system-configuration": "settings",
    "/admin/user-list": "users",
  };

  const keyToPath = {
    dashboard: "/admin/dashboard",
    quiz: "/admin/session-list",
    settings: "/system-configuration",
    users: "/admin/user-list",
  };

  const selectedKey = pathToKey[location.pathname] || "dashboard";

  return (
    <Sider
      width={220}
      style={{
        background: "#0369a1",
        paddingTop: 32,
        minHeight: "100vh",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          background: "transparent",
          fontWeight: "500",
          fontSize: "16px",
          borderRight: "none",
        }}
        onClick={({ key }) => {
          onMenuClick && onMenuClick(key);
          navigate(keyToPath[key]);
        }}
      >
        <Menu.Item key="dashboard" icon={<UserOutlined />} className="menu-item-hover">
          Dashboard
        </Menu.Item>

        <Menu.Item key="quiz" icon={<FileTextOutlined />} className="menu-item-hover">
          Session Management
        </Menu.Item>

        <Menu.Item key="settings" icon={<SettingOutlined />} className="menu-item-hover">
          System Configuration
        </Menu.Item>

        <Menu.Item key="users" icon={<TeamOutlined />} className="menu-item-hover">
          User Management
        </Menu.Item>
      </Menu>

      {/* Custom styles for colors */}
      <style>
        {`
          .menu-item-hover {
            color: white !important;
          }

          .menu-item-hover .anticon {
            color: white !important;
          }

          .menu-item-hover:hover {
            background-color: #0284c7 !important;
          }

          .menu-item-hover:hover .anticon {
            color: white !important;
          }

          .ant-menu-item-selected {
            background-color: #38bdf8 !important;
            color: white !important;
          }

          .ant-menu-item-selected .anticon {
            color: white !important;
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
