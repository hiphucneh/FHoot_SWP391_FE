import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Typography,
  Layout,
  Card,
  Space,
  message,
  Button,
  Modal,
  List,
  Divider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../../components/SideBar";
import API_BASE_URL from "../../config"; // ✅ dùng local API

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [allData, setAllData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState([]);
  const [modalTitle, setModalTitle] = useState("Leaderboard");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/session/list?pageNumber=1&pageSize=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rawData = res.data.data || [];
      let filteredData = rawData;

      if (filterStatus === "ongoing") {
        filteredData = rawData.filter((s) => !s.endAt);
      } else if (filterStatus === "ended") {
        filteredData = rawData.filter((s) => s.endAt);
      }

      setAllData(filteredData);
      setTotal(filteredData.length);

      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      setSessions(filteredData.slice(start, end));
    } catch (error) {
      message.error("Không thể tải dữ liệu phiên chơi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filterStatus, pageNumber, pageSize]);

  const fetchLeaderboard = async (sessionId, sessionName) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/session/${sessionId}/leaderboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedLeaderboard(res.data.data);
      setModalTitle(`Leaderboard - ${sessionName}`);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Leaderboard fetch error:", error.response || error);
      if (error.response?.status === 404) {
        message.warning("Chưa có dữ liệu leaderboard cho session này.");
      } else {
        message.error("Không thể tải leaderboard.");
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedLeaderboard([]);
  };

  const columns = [
    {
      title: "Session Name",
      dataIndex: "sessionName",
      key: "sessionName",
    },
    {
      title: "Session Code",
      dataIndex: "sessionCode",
      key: "sessionCode",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => new Date(value).toLocaleString("vi-VN"),
    },
    {
      title: "End At",
      dataIndex: "endAt",
      key: "endAt",
      render: (value) =>
        value ? new Date(value).toLocaleString("vi-VN") : "On Going",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            fetchLeaderboard(record.sessionCode, record.sessionName)
          }
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ padding: 24 }}>
          <Card style={{ maxWidth: 1100, margin: "0 auto 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Title level={3}>Session Management</Title>
                <Text type="secondary">
                  Total: <b>{total}</b> sessions
                </Text>
              </div>

              <Select
                value={filterStatus}
                style={{ width: 150 }}
                onChange={(value) => {
                  setFilterStatus(value);
                  setPageNumber(1);
                }}
              >
                <Option value="all">All</Option>
                <Option value="ongoing">Ongoing</Option>
                <Option value="ended">Ended</Option>
              </Select>
            </div>
          </Card>

          <Card style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Table
              dataSource={sessions}
              loading={loading}
              columns={columns}
              rowKey="sessionId"
              pagination={{
                current: pageNumber,
                pageSize: pageSize,
                total: total,
                onChange: (page, size) => {
                  setPageNumber(page);
                  setPageSize(size);
                },
                showSizeChanger: true,
              }}
            />
          </Card>

          <Modal
            title={modalTitle}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={600}
          >
            {selectedLeaderboard.map((team) => (
              <div key={team.teamId}>
                <Title level={5}>
                  #{team.rank} - {team.teamName} ({team.totalScore} điểm)
                </Title>
                <List
                  size="small"
                  dataSource={team.players}
                  renderItem={(player) => (
                    <List.Item>
                      {player.name} - {player.totalScore} điểm
                    </List.Item>
                  )}
                />
                <Divider />
              </div>
            ))}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SessionManagement;
