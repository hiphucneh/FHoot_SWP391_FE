import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
<<<<<<< HEAD
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import { SearchOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const initialUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    role: "User",
    isBlocked: false,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    role: "Admin",
    isBlocked: false,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@example.com",
    role: "User",
    isBlocked: false,
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [form] = Form.useForm();

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const handleBlockToggle = (id) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
    );
    setUsers(updated);
    message.success("User status updated!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "status",
      render: (isBlocked) => (
        <Text type={isBlocked ? "danger" : "success"}>
          {isBlocked ? "Blocked" : "Active"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={`Are you sure to ${
              record.isBlocked ? "unblock" : "block"
            } this user?`}
            onConfirm={() => handleBlockToggle(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger={record.isBlocked === false}
              type={record.isBlocked ? "default" : "primary"}
              icon={<LockOutlined />}
            >
              {record.isBlocked ? "Unblock" : "Block"}
            </Button>
          </Popconfirm>
        </Space>
=======
  Typography,
  Layout,
  Card,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../components/SideBar";

const { Title, Text } = Typography;
const { Content } = Layout;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc0NTc0MTQxMCwiaXNzIjoiS2Fob290IiwiYXVkIjoiS2Fob290IEVuZCBVc2VycyJ9.r0XtzW_BcaWiCU_oz48EXsUUOwzBjCjmGgIK3d3owfA`,
          },
        }
      );
      const { data, totalRecords } = response.data;

      setUsers(data);
      setPagination((prev) => ({
        ...prev,
        total: totalRecords,
      }));
    } catch (error) {
      message.error("Failed to fetch users!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText,
    });
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize,
      current: pagination.current,
    });
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Age", dataIndex: "age", key: "age", render: (age) => age ?? "-" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text type={status === "Active" ? "success" : "danger"}>{status}</Text>
>>>>>>> 8141ae0b2a51c1d36aa82b9d4e19aa37a703e372
      ),
    },
  ];

  return (
<<<<<<< HEAD
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffccd5, #ff85a1)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
          marginBottom: "24px",
          padding: "24px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0, color: "#d81b60" }}>
              User Management
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Total: <b>{users.length}</b> users
            </Text>
          </div>
        </div>
      </Card>

      <Card
        style={{
          maxWidth: "1100px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        }}
      >
        <Input
          placeholder="Tìm kiếm người dùng..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{
            marginBottom: 16,
            borderRadius: 8,
            borderColor: "#ff85a1",
          }}
        />

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
=======
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "linear-gradient(135deg, #bae6fd, #f3d4e5, #fef3c7)",
            borderRadius: "8px",
            minHeight: "100vh",
            overflow: "auto",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <Card
            bordered={false}
            style={{
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto 24px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              padding: "24px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <Title level={3} style={{ margin: 0, color: "#333" }}>
                  User Management
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Total: <b>{pagination.total}</b> users
                </Text>
              </div>
              <Input
                placeholder="Tìm kiếm người dùng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setPagination((prev) => ({ ...prev, current: 1 })); // reset về page 1 khi search
                  setSearchText(e.target.value);
                }}
                allowClear
                style={{
                  width: 300,
                  borderRadius: "8px",
                  borderColor: "#d1d5db",
                  background: "#f9fafb",
                  color: "#333",
                }}
              />
            </div>
          </Card>

          <Card
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              padding: "24px",
            }}
          >
            <Table
              dataSource={users}
              columns={columns}
              rowKey="userId"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
              }}
              onChange={handleTableChange}
              rowClassName={() => "table-row-hover"}
            />
          </Card>
        </Content>
      </Layout>

      <style>
        {`
          .table-row-hover:hover {
            background-color: #f9fafb !important;
            transition: background-color 0.2s ease;
          }
          .ant-table-thead > tr > th {
            background: #f3d4e5 !important;
            color: #333 !important;
            font-weight: 600 !important;
          }
          .ant-table-tbody > tr > td {
            color: #333 !important;
          }
        `}
      </style>
    </Layout>
>>>>>>> 8141ae0b2a51c1d36aa82b9d4e19aa37a703e372
  );
};

export default UserManagement;
