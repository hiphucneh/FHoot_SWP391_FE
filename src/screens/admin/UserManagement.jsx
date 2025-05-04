import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Layout,
  Card,
  message,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../components/SideBar";

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

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
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: params.search,
          },
        }
      );

      const { data } = response.data;
      setUsers(data);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
      }));
    } catch (error) {
      message.error("Failed to fetch users!");
    }
    setLoading(false);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/status/${userId}/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(`User status updated to ${newStatus}`);
      fetchUsers({
        search: searchText,
      });
    } catch (error) {
      message.error("Failed to update user status!");
    }
  };

  const showConfirm = (userId, currentStatus, newStatus) => {
    confirm({
      title: `Change user status to "${newStatus}"?`,
      content: `User ID: ${userId}, Current: ${currentStatus}`,
      onOk() {
        updateUserStatus(userId, newStatus);
      },
      onCancel() {
        message.info("Cancelled");
      },
    });
  };

  useEffect(() => {
    fetchUsers({ search: searchText });
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize,
      current: pagination.current,
    });
  };

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Age", dataIndex: "age", key: "age", render: (age) => age ?? "-" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text type={status === "Active" ? "success" : "danger"}>{status}</Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Active" && (
            <Button
              type="primary"
              danger
              onClick={() =>
                showConfirm(record.userId, record.status, "Deleted")
              }
            >
              Block
            </Button>
          )}
          {record.status === "Inactive" && (
            <Button
              type="primary"
              onClick={() =>
                showConfirm(record.userId, record.status, "Active")
              }
            >
              Activate
            </Button>
          )}
          {record.status === "Deleted" && (
            <Button
              type="primary"
              onClick={() =>
                showConfirm(record.userId, record.status, "Active")
              }
            >
              Restore
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#f0f2f5",
            borderRadius: "8px",
            overflow: "auto",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <Card
            bordered={false}
            style={{
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
                placeholder="Search user..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setPagination((prev) => ({ ...prev, current: 1 }));
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

        {/* Inline table style */}
        <style>
          {`
            .table-row-hover:hover {
              background-color: #f9fafb !important;
              transition: background-color 0.2s ease;
            }
            .ant-table-thead > tr > th {
              background: #e0f2fe !important;
              color: #333 !important;
              font-weight: 600 !important;
            }
            .ant-table-tbody > tr > td {
              color: #333 !important;
            }
          `}
        </style>
      </Layout>
    </Layout>
  );
};

export default UserManagement;
