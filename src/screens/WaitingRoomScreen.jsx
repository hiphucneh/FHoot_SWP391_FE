import React, { useEffect, useState, useCallback } from "react";
import { Card, Typography, Spin, Tag } from "antd";
import { LoadingOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import useSignalR from "../hooks/useSignalR";
import { useNavigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const WaitingRoomScreen = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = location.state || {};
  // const teamId = "165";
  const sessionCode = localStorage.getItem("sessionCode");
  const [firstQuestion, setFirstQuestion] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  // Fetch team data
  const fetchTeamScore = async () => {
    const token = localStorage.getItem("token");
    if (!teamId || !sessionCode) {
      setError("Missing teamId or sessionCode");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/${teamId}/score`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const text = await response.text();
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Response: ${text}`
        );
      }
      const result = JSON.parse(text);
      if (result.statusCode === 200) {
        setTeamData(result.data);
      } else {
        throw new Error(result.message || "API error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroups = useCallback(() => {
    console.log("✅ Session started: waiting for question...");
    setIsSessionStarted(true);
  }, []);

  useEffect(() => {
    if (isSessionStarted && firstQuestion) {
      console.log("🚀 Navigating to QnA screen with first question");
      navigate("/answer", { state: { teamId, sessionCode, firstQuestion } });
    }
  }, [isSessionStarted, firstQuestion, navigate, teamId, sessionCode]);

  const handleNextQuestionSignalR = (newQuestion) => {
    setFirstQuestion(newQuestion);
    setTimeLeft(timeLimitSec);
  };

  const handleSessionStarted = useCallback(() => {
    navigate("/answer", { state: { teamId, sessionCode, firstQuestion } });
  }, [navigate, teamId, sessionCode]);

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onUpdateGroups: handleUpdateGroups,
    onNextQuestion: handleNextQuestionSignalR,
  });

  // Join session via SignalR
  useEffect(() => {
    const joinSessionIfConnected = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
          console.log("📥 Joined session:", sessionCode);
        } catch (err) {
          console.error("❌ Failed to join session:", err);
          setError("Không thể tham gia phiên. Vui lòng thử lại.");
        }
      }
    };

    if (sessionCode) {
      const timer = setTimeout(joinSessionIfConnected, 1000);
      return () => clearTimeout(timer);
    }
  }, [connectionRef, sessionCode]);

  // Fetch team data on mount
  useEffect(() => {
    fetchTeamScore();
  }, [teamId]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 32, color: "white" }} spin />
          }
        />
        <Text
          style={{
            fontSize: 18,
            color: "#ffffff",
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
            display: "block",
            marginTop: 16,
          }}
        >
          Loading team data...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#ffffff",
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          }}
        >
          Error: {error}
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <Title
        level={2}
        style={{
          color: "#fff",
          textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
          marginBottom: "8px",
        }}
      >
        👋 Welcome Kahoot!
      </Title>

      <Text
        style={{
          fontSize: 18,
          color: "#ffffff",
          fontWeight: "bold",
          marginBottom: "24px",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        You're in <span style={{ color: "#ffd6e0" }}>{teamData.teamName}</span>
      </Text>

      <Card
        title={
          <span style={{ color: "#d81b60", fontWeight: "bold" }}>
            <TeamOutlined style={{ marginRight: 8 }} />
            {teamData.teamName}
          </span>
        }
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {teamData.players.map((player, index) => (
            <Tag
              key={index}
              color="pink"
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: 14,
                fontWeight: "bold",
                color: "#d81b60",
                background: "#fff0f6",
                border: "1px solid #ff85a1",
              }}
            >
              {player.imageUrl ? (
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    marginRight: 6,
                  }}
                />
              ) : (
                <UserOutlined style={{ marginRight: 6 }} />
              )}
              {player.name}
            </Tag>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 32 }}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 32, color: "white" }} spin />
          }
        />
        <Text
          style={{
            fontSize: 18,
            color: "#ffffff",
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
            display: "block",
            marginTop: 16,
          }}
        >
          Waiting for the host to start the game...
        </Text>
      </div>
    </div>
  );
};

export default WaitingRoomScreen;
