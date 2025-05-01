import React from "react";
import { Card, Typography, Space, Button, Tag } from "antd";
import Lottie from "lottie-react";
import confettiAnimation from "../assets/animations/congratuation.json";
const { Title, Text } = Typography;

const PlayerResultScreen = ({
  teamName = "Your Team",
  rank = 1,
  score = 0,
  sessionCode = "SAMPLE_CODE",
}) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
        padding: "24px",
        position: "relative", // ⬅ để chứa animation phía dưới
        overflow: "hidden",
      }}
    >
      {/* 🎉 Confetti Animation */}
      <Lottie
        animationData={confettiAnimation}
        loop={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none", // không làm ảnh hưởng tới click
        }}
      />

      {/* Nội dung UI */}
      <Space
        direction="vertical"
        size="large"
        align="center"
        style={{ zIndex: 1 }}
      >
        <Title
          level={2}
          style={{
            color: "#fff",
            textShadow: "1px 1px 6px rgba(0,0,0,0.4)",
            animation: "pulse 2s infinite",
            marginBottom: 0,
          }}
        >
          🎉 CONGRATULATIONS! 🎉
        </Title>
        <Text
          style={{
            fontSize: 18,
            color: "#ffffff",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          }}
        >
          Amazing job, {teamName}!
        </Text>

        <Card
          style={{
            width: "90vw",
            maxWidth: 500,
            borderRadius: 16,
            boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            padding: 16,
            background:
              rank === 1
                ? "rgba(255, 248, 220, 0.95)"
                : rank === 2
                ? "rgba(240, 240, 240, 0.95)"
                : rank === 3
                ? "rgba(251, 231, 208, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            border: `2px solid ${
              rank === 1
                ? "#FFD700"
                : rank === 2
                ? "#C0C0C0"
                : rank === 3
                ? "#CD7F32"
                : "#d81b60"
            }`,
            textAlign: "center",
          }}
        >
          <Space direction="vertical" size="middle">
            <div>
              <Text strong style={{ fontSize: 20, color: "#d81b60" }}>
                Your Team: {teamName}
              </Text>
            </div>
            <div>
              <Text style={{ fontSize: 18, color: "#ff4081" }}>
                Rank:{" "}
                {rank === 1 ? (
                  <Tag color="gold">🥇 1st</Tag>
                ) : rank === 2 ? (
                  <Tag color="silver">🥈 2nd</Tag>
                ) : rank === 3 ? (
                  <Tag color="volcano">🥉 3rd</Tag>
                ) : (
                  <Tag>{rank}th</Tag>
                )}
              </Text>
            </div>
            <div>
              <Text strong style={{ fontSize: 24, color: "#ff4081" }}>
                Score: {score}
              </Text>
            </div>
          </Space>
        </Card>

        <Button
          onClick={() => {
            localStorage.removeItem("sessionCode");
            window.location.href = "/join-session";
          }}
          type="primary"
          size="large"
          style={{
            backgroundColor: "#d81b60",
            borderColor: "#d81b60",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Back to Join Session
        </Button>

        <Text
          style={{
            fontSize: 16,
            color: "#ffffff",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          }}
        >
          Session Code: <span>{sessionCode}</span>
        </Text>
      </Space>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default PlayerResultScreen;
