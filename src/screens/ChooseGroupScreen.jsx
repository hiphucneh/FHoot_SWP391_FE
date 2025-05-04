import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Spin,
  message,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChooseGroupScreen.module.css";

const { Title, Text } = Typography;

const ChooseGroupScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const sessionCode = localStorage.getItem("sessionCode");
      if (!sessionCode) {
        message.error("Session code not found. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/session/${sessionCode}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data?.data)) {
          const groupData = response.data.data.map((team) => ({
            id: team.teamId,
            name: team.teamName,
          }));
          setGroups(groupData);
        } else {
          message.error("No groups found for this session.");
        }
      } catch (error) {
        message.error("Failed to fetch groups.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        message.error("Failed to fetch user info.");
      }
    };

    fetchUserInfo();
    fetchGroups();
  }, []);

  const handleGroupClick = async (teamId) => {
    const sessionCode = localStorage.getItem("sessionCode");
    if (!sessionCode || !userInfo?.name) {
      message.error("Missing session or user info.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("teamId", teamId);
      formData.append("fullName", userInfo.name);

      const response = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/${sessionCode}/join`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        message.success("Joined the team successfully!");
        navigate("/waiting-room", {
          state: { teamId },
        });
      } else {
        message.error("Failed to join the team.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error joining the team."
      );
    }
  };

  return (
    <div className={styles.container}>
      {userInfo && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
          <Avatar
            size={64}
            src={userInfo.avatar || null}
            icon={!userInfo.avatar && <UserOutlined />}
          />
          <Text style={{ color: "#fff", fontSize: "1.2rem" }}>
            Welcome, {userInfo.name || "Player"}!
          </Text>
        </div>
      )}

      <Title level={2} className={styles.title}>
        Choose Your Group
      </Title>

      {loading ? (
        <Spin size="large" style={{ marginTop: "4rem" }} />
      ) : (
        <Row gutter={[24, 24]} justify="center" style={{ width: "100%", maxWidth: "1000px" }}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <Col xs={24} sm={12} md={8} lg={6} key={group.id}>
                <Card
                  hoverable
                  onClick={() => handleGroupClick(group.id)}
                  className={styles.card}
                >
                  {group.name}
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Text className={styles.noGroups}>No groups available.</Text>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default ChooseGroupScreen;
