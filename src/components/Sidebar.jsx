import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToKey = {
    "/admin/dashboard": "dashboard",
    "/admin/session-list": "quiz",
  };

  const keyToPath = {
    dashboard: "/admin/dashboard",
    quiz: "/admin/session-list",
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
          color: "#d1d5db",
          fontWeight: "500",
          fontSize: "16px",
          borderRight: "none",
        }}
        onClick={({ key }) => {
          onMenuClick && onMenuClick(key);
          navigate(keyToPath[key]);
        }}
      >
        <Menu.Item
          key="dashboard"
          icon={<UserOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          Dashboard
        </Menu.Item>
        <Menu.Item
          key="quiz"
          icon={<FileTextOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          Session Management
        </Menu.Item>
      </Menu>

      <style>
        {`
          .menu-item-hover:hover {
            background-color: #0284c7 !important;
            color: #fff !important;
          }
          .menu-item-hover:hover .anticon {
            color: #fff !important;
          }
          .ant-menu-item-selected {
            background-color: #38bdf8 !important;
            color: #fff !important;
          }
          .ant-menu-item-selected .anticon {
            color: #fff !important;
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
