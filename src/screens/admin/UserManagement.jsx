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

  // Hàm lấy danh sách người dùng
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc0NTgyODI2NiwiaXNzIjoiS2Fob290IiwiYXVkIjoiS2Fob290IEVuZCBVc2VycyJ9.d7bk3Q5T1jeaeytA96v91VUEG6ZC-cORzPhtpYf0auQ`,
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

  // Hàm thay đổi trạng thái người dùng
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.put(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/status/${userId}/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc0NTgyODI2NiwiaXNzIjoiS2Fob290IiwiYXVkIjoiS2Fob290IEVuZCBVc2VycyJ9.d7bk3Q5T1jeaeytA96v91VUEG6ZC-cORzPhtpYf0auQ`,
          },
        }
      );
      message.success(`User status updated to ${newStatus} successfully!`);
      // Làm mới danh sách người dùng sau khi cập nhật
      fetchUsers({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText,
      });
    } catch (error) {
      console.error("Error updating user status:", error.response?.data);
      message.error("Failed to update user status!");
    }
  };

  // Xác nhận trước khi thay đổi trạng thái
  const showConfirm = (userId, currentStatus, newStatus) => {
    confirm({
      title: `Are you sure you want to change this user's status to "${newStatus}"?`,
      content: `User ID: ${userId}, Current Status: ${currentStatus}`,
      onOk() {
        updateUserStatus(userId, newStatus);
      },
      onCancel() {
        message.info("Action cancelled");
      },
    });
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

  // Cột của bảng, bao gồm cột "Action"
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
            <>
              <Button
                type="primary"
                danger
                onClick={() =>
                  showConfirm(record.userId, record.status, "Deleted")
                }
              >
                Block
              </Button>
            </>
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
  );
};

export default UserManagement;
