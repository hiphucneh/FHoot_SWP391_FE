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
import Sidebar from "../../components/Sidebar";
import styles from "./UserManagement.module.css";

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.data.length,
      }));
    } catch {
      message.error("Failed to fetch users!");
    }
    setLoading(false);
  };

  const fetchUserPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package/user-package",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPackages(response.data.data || []);
    } catch {
      message.warning("Failed to fetch user packages.");
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/status/${userId}/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch {
      message.error("Failed to update user status!");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/role/${userId}/${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Role updated successfully");
      fetchUsers();
    } catch {
      message.error("Failed to update user role!");
    }
  };

  const getPackageByUserId = (userId) =>
    userPackages.find((p) => p.userId === userId);

  const showConfirm = (userId, currentStatus, newStatus) => {
    confirm({
      title: `Change user status to "${newStatus}"?`,
      content: `User ID: ${userId}, Current: ${currentStatus}`,
      onOk() {
        updateUserStatus(userId, newStatus);
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "userId" },
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Age", dataIndex: "age", render: (age) => age ?? "-" },
    {
      title: "Subscription",
      key: "package",
      render: (_, record) => {
        const pkg = getPackageByUserId(record.userId);
        return pkg ? (
          <Button type="link" onClick={() => setSelectedPackage(pkg)}>
            {pkg.packageName}
          </Button>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Text type={status === "Active" ? "success" : "danger"}>
          {status}
        </Text>
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
          {["Inactive", "Deleted"].includes(record.status) && (
            <Button
              type="primary"
              onClick={() =>
                showConfirm(record.userId, record.status, "Active")
              }
            >
              {record.status === "Inactive" ? "Activate" : "Restore"}
            </Button>
          )}
          <Button
            type="default"
            onClick={() => {
              let selectedRole = record.role === "User" ? "Teacher" : "User";
              Modal.confirm({
                title: "Choose the target role",
                content: (
                  <select
                    defaultValue={selectedRole}
                    onChange={(e) => (selectedRole = e.target.value)}
                    style={{ width: "100%", marginTop: 10 }}
                  >
                    <option value="User">User</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                ),
                onOk() {
                  return updateUserRole(record.userId, selectedRole);
                },
              });
            }}
          >
            Change Role
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination });
  };

  useEffect(() => {
    fetchUsers();
    fetchUserPackages();
  }, []);

  return (
    <Layout className={styles.layout}>
      <Sidebar />
      <Layout>
        <Content className={styles.content}>
          <Card bordered={false} className={styles.headerCard}>
            <div className={styles.header}>
              <div>
                <Title level={3}>User Management</Title>
                <Text type="secondary">
                  Total: <b>{pagination.total}</b> users
                </Text>
              </div>
              <Input
                placeholder="Search user..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </Card>

          <Card className={styles.tableCard}>
            <Table
              dataSource={users.filter((u) =>
                u.fullName.toLowerCase().includes(searchText.toLowerCase())
              )}
              columns={columns}
              rowKey="userId"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Card>

          <Modal
            title="Package Details"
            open={!!selectedPackage}
            onCancel={() => setSelectedPackage(null)}
            footer={null}
          >
            {selectedPackage && (
              <>
                <p>
                  <b>Package:</b> {selectedPackage.packageName}
                </p>
                <p>
                  <b>Start Date:</b>{" "}
                  {new Date(selectedPackage.startDate).toLocaleString()}
                </p>
                <p>
                  <b>Expiry Date:</b>{" "}
                  {new Date(selectedPackage.expiryDate).toLocaleString()}
                </p>
                <p>
                  <b>Status:</b> {selectedPackage.status}
                </p>
              </>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserManagement;
