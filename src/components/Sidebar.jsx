import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ onMenuClick }) => {
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
      <div
        style={{
          height: 64,
          marginBottom: 24,
          textAlign: "center",
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Admin
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["user"]}
        style={{
          background: "transparent",
          color: "#d1d5db",
          fontWeight: "500",
          fontSize: "16px",
          borderRight: "none",
        }}
        onClick={({ key }) => onMenuClick(key)}
      >
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
          Quiz Management
        </Menu.Item>
        <Menu.Item
          key="settings"
          icon={<SettingOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          Setting
        </Menu.Item>
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          style={{
            color: "white",
            marginBottom: "8px",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          className="menu-item-hover"
        >
          Logout
        </Menu.Item>
      </Menu>

      <style>
        {`
          .menu-item-hover:hover {
            background-color: #0284c7 !important; // Slightly lighter blue on hover
            color: #fff !important;
          }
          .menu-item-hover:hover .anticon {
            color: #fff !important;
          }
          .ant-menu-item-selected {
            background-color: #38bdf8 !important; // Softer blue for selected item
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
