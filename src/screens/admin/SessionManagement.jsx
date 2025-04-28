import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Typography,
  Layout,
  Card,
  message,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../components/SideBar";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchSessions = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/my-session",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJUZWFjaGVyIiwiZXhwIjoxNzQ1ODI0NzA3LCJpc3MiOiJLYWhvb3QiLCJhdWQiOiJLYWhvb3QgRW5kIFVzZXJzIn0.hCdzIKzy04JWUEkrbWvZ2774LabiNtY2QgQ4Eu_GTFE`,
          },
          params: {
            pageIndex: params.pageIndex || 1,
            pageSize: params.pageSize || 5,
            search: params.search || "",
          },
        }
      );
      const { data } = response.data;

      setSessions(
        data.filter((session) => {
          if (statusFilter === "ongoing") return !session.endAt;
          if (statusFilter === "ended") return !!session.endAt;
          return true;
        })
      );
      setPagination((prev) => ({
        ...prev,
        total: data.length,
      }));
    } catch (error) {
      message.error("Failed to fetch sessions!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText,
    });
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize,
      current: pagination.current,
    });
  };

  const columns = [
    { title: "Session Name", dataIndex: "sessionName", key: "sessionName" },
    { title: "Session Code", dataIndex: "sessionCode", key: "sessionCode" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "End At",
      dataIndex: "endAt",
      key: "endAt",
      render: (date) => (date ? new Date(date).toLocaleString() : "Ongoing"),
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
                gap: "16px",
              }}
            >
              <div>
                <Title level={3} style={{ margin: 0, color: "#333" }}>
                  Session Management
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Total: <b>{pagination.total}</b> sessions
                </Text>
              </div>

              <Space>
                <Input
                  placeholder="Search session..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => {
                    setPagination((prev) => ({ ...prev, current: 1 }));
                    setSearchText(e.target.value);
                  }}
                  allowClear
                  style={{
                    width: 250,
                    borderRadius: "8px",
                    borderColor: "#d1d5db",
                    background: "#f9fafb",
                    color: "#333",
                  }}
                />

                <Select
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPagination((prev) => ({ ...prev, current: 1 }));
                  }}
                  style={{
                    width: 150,
                    borderRadius: "8px",
                    background: "#f9fafb",
                  }}
                >
                  <Option value="all">All</Option>
                  <Option value="ongoing">Ongoing</Option>
                  <Option value="ended">Ended</Option>
                </Select>
              </Space>
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
              dataSource={sessions}
              columns={columns}
              rowKey="sessionId"
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

export default SessionManagement;
