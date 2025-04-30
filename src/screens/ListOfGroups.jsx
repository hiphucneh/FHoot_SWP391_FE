import React, { useState, useEffect, useCallback } from "react";
import { Card, Typography, Space, Tag, Row, Col, Button, message } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSignalR from "../hooks/useSignalR";

const { Title, Text } = Typography;

const ListOfGroups = () => {
  const [groups, setGroups] = useState([]);
  const sessionCode = localStorage.getItem("sessionCode");
  const roomCode = sessionCode;
  const navigate = useNavigate();

  const fetchTeamsBySession = async () => {
    const token = localStorage.getItem("token");
    if (!sessionCode) {
      message.error("Không tìm thấy mã phiên! Vui lòng tạo lại phiên.");
      navigate("/create-session");
      return;
    }

    try {
      const response = await axios.get(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/session/${sessionCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      const teams = response.data.data;
      const transformed = teams.map((team) => ({
        name: team.teamName,
        members: team.players.map((p) => p.name),
        max: 5,
      }));

      setGroups(transformed);
    } catch (error) {
      console.error("❌ Error fetching teams:", error);
      message.error("Không thể tải danh sách nhóm. Vui lòng thử lại.");
    }
  };

  const startSession = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      if (response.status === 200) {
        message.success("Session started successfully!");
        console.log("✅ Session started:", response.data);
      }
    } catch (error) {
      console.error("❌ Error starting session:", error);
      message.error("Failed to start session. Please try again.");
    }
  };

  useEffect(() => {
    fetchTeamsBySession();
  }, []);

  const handleUpdateGroups = useCallback(() => {
    console.log("✅ Real-time update groups");
    fetchTeamsBySession();
  }, []);

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onUpdateGroups: handleUpdateGroups,
  });

  useEffect(() => {
    const joinSessionIfConnected = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
          console.log("📥 Joined session:", sessionCode);
        } catch (err) {
          console.error("❌ Failed to join session:", err);
          message.error("Không thể tham gia phiên. Vui lòng thử lại.");
        }
      }
    };

    const timer = setTimeout(joinSessionIfConnected, 1000);

    return () => clearTimeout(timer);
  }, [connectionRef, sessionCode]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)", // Match CreateSession
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
          background: "rgba(255, 255, 255, 0.95)", // Match CreateSession
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          marginBottom: "32px",
          padding: "16px",
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
          <Space>
            <TeamOutlined style={{ fontSize: 24, color: "#d81b60" }} />{" "}
            {/* Match primary color */}
            <Text
              strong
              style={{
                fontSize: 20,
                color: "#d81b60", // Match primary color
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              {groups.reduce((acc, g) => acc + g.members.length, 0)} PLAYERS
            </Text>
          </Space>

          <Title
            level={2}
            style={{
              margin: 0,
              color: "#d81b60", // Match primary color
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              animation: "pulse 2s infinite",
            }}
          >
            🎉 WAITING ROOM
          </Title>

          <Space>
            <Text
              style={{
                fontSize: 18,
                color: "#d81b60", // Match primary color
                fontWeight: "bold",
              }}
            >
              GAME PIN: <span style={{ color: "#ff4081" }}>{roomCode}</span>{" "}
              {/* Keep highlight color */}
            </Text>
          </Space>
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={startSession}
            style={{
              background: "#d81b60", // Match CreateSession button
              borderColor: "#d81b60",
              borderRadius: "8px",
              padding: "8px 24px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Start Game
          </Button>
        </div>
      </Card>

      <Row gutter={[24, 24]} style={{ maxWidth: "1100px", width: "100%" }}>
        {groups.map((group, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card
              title={
                <div style={{ color: "#d81b60", fontWeight: "bold" }}>
                  {group.name}
                </div>
              }
              bordered={false}
              style={{
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.95)", // Match CreateSession
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text strong>
                  Member: {group.members.length}/{group.max}
                </Text>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {group.members.map((member, index) => (
                  <Tag
                    key={index}
                    color="pink"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#d81b60", // Match primary color
                      background: "#fff0f6",
                      border: "1px solid #ff4081", // Match highlight color
                    }}
                  >
                    <UserOutlined
                      style={{ marginRight: 6, color: "#d81b60" }}
                    />
                    {member}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          `}
      </style>
    </div>
  );
};

export default ListOfGroups;
