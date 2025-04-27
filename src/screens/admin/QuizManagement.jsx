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
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../components/SideBar";

const { Title, Text } = Typography;
const { Content } = Layout;

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/my-quiz",
        {
          headers: {
            Authorization: `Bearer veyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc0NTc0MTQxMCwiaXNzIjoiS2Fob290IiwiYXVkIjoiS2Fob290IEVuZCBVc2VycyJ9.r0XtzW_BcaWiCU_oz48EXsUUOwzBjCjmGgIK3d3owfA`, // Token fix cứng bạn cho
          },
          params: {
            pageIndex: params.pageIndex || 1,
            pageSize: params.pageSize || 5,
            search: params.search || "",
          },
        }
      );
      const { data, totalRecords } = response.data;

      setQuizzes(data);
      setPagination((prev) => ({
        ...prev,
        total: totalRecords,
      }));
    } catch (error) {
      message.error("Failed to fetch quizzes!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes({
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
    { title: "Quiz Name", dataIndex: "quizName", key: "quizName" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text type={status === "Active" ? "success" : "danger"}>{status}</Text>
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
                  Quiz Management
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Total: <b>{pagination.total}</b> quizzes
                </Text>
              </div>
              <Input
                placeholder="Tìm kiếm quiz..."
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
              dataSource={quizzes}
              columns={columns}
              rowKey="quizId"
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

export default QuizManagement;
