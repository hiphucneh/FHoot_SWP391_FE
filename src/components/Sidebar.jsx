import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
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
    "/admin/settings": "settings",
    "/admin/system-configuration": "sysConfig",
    "/admin/package-management": "package",
    "/admin/user-list": "user"

  };

  const keyToPath = {
    dashboard: "/admin/dashboard",
    sysConfig: "/admin/system-configuration",
    user: "/admin/user-list",
    quiz: "/admin/session-list",
    settings: "/admin/settings",
    package: "/admin/package-management"

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
        <Menu.Item
          key="sysConfig"
          icon={<UserOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          System configuration
        </Menu.Item>
        <Menu.Item
          key="user"
          icon={<UserOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          User Management
        </Menu.Item>
        <Menu.Item
          key="package"
          icon={<UserOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          Package Management
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
