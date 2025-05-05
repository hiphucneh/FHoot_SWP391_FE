import React, { useEffect, useState, useCallback } from "react";
import { Card, Typography, Spin, Tag } from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import useSignalR from "../hooks/useSignalR";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./WaitingRoomScreen.module.css";

const { Title, Text } = Typography;

const WaitingRoomScreen = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = location.state || {};
  const sessionCode = localStorage.getItem("sessionCode");
  const [firstQuestion, setFirstQuestion] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

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
    setIsSessionStarted(true);
  }, []);

  const handleNextQuestionSignalR = (newQuestion) => {
    setFirstQuestion(newQuestion);
  };

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onUpdateGroups: handleUpdateGroups,
    onNextQuestion: handleNextQuestionSignalR,
  });

  useEffect(() => {
    if (isSessionStarted && firstQuestion) {
      navigate("/answer", { state: { teamId, sessionCode, firstQuestion } });
    }
  }, [isSessionStarted, firstQuestion, navigate, teamId, sessionCode]);

  useEffect(() => {
    const joinSessionIfConnected = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
        } catch (err) {
          console.error("❌ Failed to join session:", err);
          setError("Could not join session.");
        }
      }
    };

    if (sessionCode) {
      const timer = setTimeout(joinSessionIfConnected, 1000);
      return () => clearTimeout(timer);
    }
  }, [connectionRef, sessionCode]);

  useEffect(() => {
    fetchTeamScore();
  }, [teamId]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 32, color: "white" }} spin />
          }
        />
        <Text className={styles.loadingText}>Loading team data...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <Text className={styles.loadingText}>Error: {error}</Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Title level={2} className={styles.title}>👋 Welcome Kahoot!</Title>
      <Text className={styles.subtext}>
        You're in <span className={styles.teamName}>{teamData.teamName}</span>
      </Text>

      <Card
        title={
          <span className={styles.cardTitle}>
            <TeamOutlined /> {teamData.teamName}
          </span>
        }
        className={styles.card}
      >
        <div className={styles.tagList}>
          {teamData.players.map((player, index) => (
            <Tag
              key={index}
              className={styles.playerTag}
              icon={
                player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className={styles.avatar}
                  />
                ) : (
                  <UserOutlined />
                )
              }
            >
              {player.name}
            </Tag>
          ))}
        </div>
      </Card>

      <div className={styles.waitingBox}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 32, color: "white" }} spin />
          }
        />
        <Text className={styles.waitingText}>
          Waiting for the host to start the game...
        </Text>
      </div>
    </div>
  );
};

export default WaitingRoomScreen;
