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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const getPackageByUserId = (userId) => {
    return userPackages.find((p) => p.userId === userId);
  };

  const columns = [
    { title: "ID", dataIndex: "userId" },
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Age", dataIndex: "age", render: (age) => age ?? "-" },
    {
      title: "Package",
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
              onClick={() => showConfirm(record.userId, record.status, "Deleted")}
            >
              Block
            </Button>
          )}
          {record.status === "Inactive" && (
            <Button
              type="primary"
              onClick={() => showConfirm(record.userId, record.status, "Active")}
            >
              Activate
            </Button>
          )}
          {record.status === "Deleted" && (
            <Button
              type="primary"
              onClick={() => showConfirm(record.userId, record.status, "Active")}
            >
              Restore
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const showConfirm = (userId, currentStatus, newStatus) => {
    confirm({
      title: `Change user status to "${newStatus}"?`,
      content: `User ID: ${userId}, Current: ${currentStatus}`,
      onOk() {
        updateUserStatus(userId, newStatus);
      },
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination });
  };

  useEffect(() => {
    fetchUsers();
    fetchUserPackages();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ padding: 24 }}>
          <Card
            bordered={false}
            style={{
              maxWidth: "1100px",
              margin: "0 auto 24px",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                style={{ width: 300 }}
              />
            </div>
          </Card>

          <Card
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <Table
              dataSource={users}
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
                <p><b>Gói:</b> {selectedPackage.packageName}</p>
                <p><b>Bắt đầu:</b> {new Date(selectedPackage.startDate).toLocaleString()}</p>
                <p><b>Hết hạn:</b> {new Date(selectedPackage.expiryDate).toLocaleString()}</p>
                <p><b>Trạng thái:</b> {selectedPackage.status}</p>
              </>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserManagement;
