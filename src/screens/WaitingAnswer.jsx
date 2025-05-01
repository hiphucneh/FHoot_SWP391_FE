import React from "react";
import { Typography, Spin } from "antd";
import { LoadingOutlined, SmileOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const WaitingAnswer = () => {
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
      <SmileOutlined style={{ fontSize: 64, color: "#fff" }} />
      <Title
        level={2}
        style={{
          color: "#ffffff",
          textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
          marginBottom: "8px",
          marginTop: "16px",
        }}
      >
        🎉 Answer Submitted!
      </Title>

      <Text
        style={{
          fontSize: 18,
          color: "#ffffff",
          fontWeight: "bold",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          marginBottom: 32,
        }}
      >
        Waiting for others to finish...
      </Text>

      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 32, color: "white" }} spin />
        }
      />
    </div>
  );
};

export default WaitingAnswer;
