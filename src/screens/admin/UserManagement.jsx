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
import API_BASE_URL from "../../config";

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sorter, setSorter] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
  `${API_BASE_URL}/api/user?pageIndex=1&pageSize=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const all = response.data.data || [];
      setAllUsers(all);
      paginateData(all, 1, pagination.pageSize); // reset về trang 1
    } catch {
      message.error("Failed to fetch users!");
    }
    setLoading(false);
  };

  const fetchUserPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
  `${API_BASE_URL}/api/user?pageIndex=1&pageSize=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPackages(response.data.data || []);
    } catch {
      message.warning("Failed to fetch user packages.");
    }
  };

  const paginateData = (data, page, size, currentSorter = sorter) => {
    let filtered = data.filter((u) =>
      u.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Apply sorting
    if (currentSorter?.field && currentSorter?.order) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[currentSorter.field];
        const bValue = b[currentSorter.field];
        if (typeof aValue === "number") {
          return currentSorter.order === "ascend" ? aValue - bValue : bValue - aValue;
        } else {
          return currentSorter.order === "ascend"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }
      });
    }

    const start = (page - 1) * size;
    const end = start + size;

    setUsers(filtered.slice(start, end));
    setPagination({
      current: page,
      pageSize: size,
      total: filtered.length,
    });
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
  `${API_BASE_URL}/api/user?pageIndex=1&pageSize=1000`,
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
      const response = await axios.get(
  `${API_BASE_URL}/api/user?pageIndex=1&pageSize=1000`,
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
    { title: "ID", dataIndex: "userId", sorter: true },
    { title: "Full Name", dataIndex: "fullName", sorter: true },
    { title: "Email", dataIndex: "email", sorter: true },
    {
      title: "Age",
      dataIndex: "age",
      render: (age) => age ?? "-",
      sorter: true,
    },
    { title: "Role", dataIndex: "role", sorter: true },
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
        <Text type={status === "Active" ? "success" : "danger"}>{status}</Text>
      ),
      sorter: true,
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

  const handleTableChange = (pagination, filters, sorterArg) => {
    setSorter(sorterArg);
    paginateData(allUsers, pagination.current, pagination.pageSize, sorterArg);
  };

  useEffect(() => {
    fetchUsers();
    fetchUserPackages();
  }, []);

  useEffect(() => {
    paginateData(allUsers, 1, pagination.pageSize, sorter);
  }, [searchText]);

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
              dataSource={users}
              columns={columns}
              rowKey="userId"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ["6", "10", "20", "50"],
              }}
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