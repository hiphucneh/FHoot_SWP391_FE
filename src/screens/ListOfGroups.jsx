import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Button,
  message,
  Spin,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSignalR from "../hooks/useSignalR";
import styles from "./ListOfGroups.module.css";

import bgMusic from "../assets/sound/bg-music.mp3";
import startSound from "../assets/sound/start.mp3";

const { Title, Text } = Typography;

const ListOfGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loadingStart, setLoadingStart] = useState(false);
  const sessionCode = localStorage.getItem("sessionCode");
  const navigate = useNavigate();

  const bgAudioRef = useRef(null);
  const startAudioRef = useRef(null);

  const fetchTeams = async () => {
    const token = localStorage.getItem("token");
    if (!sessionCode) {
      message.error("Missing session code.");
      return navigate("/create-session");
    }

    try {
      const res = await axios.get(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/session/${sessionCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const teams = res.data.data || [];
      const transformed = teams.map((t) => ({
        name: t.teamName,
        members: t.players.map((p) => p.name),
        max: 5,
      }));
      setGroups(transformed);
    } catch (err) {
      console.error(err);
      message.error("Failed to load groups.");
    }
  };

  const fadeOutAudio = (audio, duration = 1000) => {
    if (!audio) return;
    const step = audio.volume / (duration / 50);
    const fade = setInterval(() => {
      if (audio.volume > step) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fade);
      }
    }, 50);
  };

  const startGame = async () => {
    const token = localStorage.getItem("token");
    setLoadingStart(true);
    try {
      const res = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data?.data;
      if (!data) throw new Error("Invalid response");

      // Play sound and fade out music
      startAudioRef.current?.play().catch(() => {});
      fadeOutAudio(bgAudioRef.current, 1000);

      // Wait 1s to let the sound play
      setTimeout(() => {
        message.success("Game Started!");
        navigate("/load", {
          state: { sessionCode, totalQuestion: data.length },
        });        
      }, 1000);
    } catch (err) {
      message.error("Cannot start game.");
      setLoadingStart(false);
    }
  };

  const handleUpdateGroups = useCallback(() => {
    fetchTeams();
  }, []);

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onUpdateGroups: handleUpdateGroups,
  });

  useEffect(() => {
    fetchTeams();
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.4;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const connection = connectionRef?.current;
      if (connection?.state === "Connected") {
        connection.invoke("JoinSession", sessionCode).catch(console.error);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [connectionRef, sessionCode]);

  return (
    <div className={styles.wrapper}>
      <audio ref={bgAudioRef} src={bgMusic} />
      <audio ref={startAudioRef} src={startSound} />

      <Card bordered={false} className={styles.headerCard}>
        <div className={styles.headerTop}>
          <Space>
            <TeamOutlined className={styles.teamIcon} />
            <Text className={styles.playerCount}>
              {groups.reduce((acc, g) => acc + g.members.length, 0)} PLAYERS
            </Text>
          </Space>
          <Title level={2} className={styles.title}>
            🎉 WAITING ROOM
          </Title>
          <Text className={styles.pin}>
            GAME PIN: <span>{sessionCode}</span>
          </Text>
        </div>
        <div className={styles.centerBtn}>
          <Button
            className={styles.startBtn}
            onClick={startGame}
            icon={<SoundOutlined />}
            size="large"
            loading={loadingStart}
          >
            {loadingStart ? "Starting..." : "Start Game"}
          </Button>
        </div>
      </Card>

      <Row gutter={[24, 24]} className={styles.groupRow}>
        {groups.map((group, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card
              title={<div className={styles.groupTitle}>{group.name}</div>}
              bordered={false}
              className={styles.groupCard}
            >
              <Text strong>
                Members: {group.members.length}/{group.max}
              </Text>
              <div className={styles.tagsWrap}>
                {group.members.map((member, i) => (
                  <Tag key={i} color="pink" className={styles.memberTag}>
                    <UserOutlined /> {member}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListOfGroups;
