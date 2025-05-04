import React from "react";
import { Typography, Card, Button } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AnswerResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCorrect, correctAnswer, yourAnswer } = location.state || {};

  return (
    <div
      style={{
        height: "100vh",
        background: isCorrect
          ? "linear-gradient(135deg, #a8edea, #fed6e3)"
          : "linear-gradient(135deg, #ff758c, #ff7eb3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <Card
        style={{
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          maxWidth: 500,
          width: "100%",
        }}
      >
        {isCorrect ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
        ) : (
          <CloseCircleTwoTone twoToneColor="#f5222d" style={{ fontSize: 64 }} />
        )}

        <Title level={2} style={{ marginTop: 16 }}>
          {isCorrect ? "🎉 Bingo!!" : "😢 Oops!!"}
        </Title>

        {/* <Text strong style={{ fontSize: 16 }}>
          Your points:{" "}
          <span style={{ color: isCorrect ? "#52c41a" : "#f5222d" }}>
            {yourAnswer}
          </span>
        </Text>
        <br /> */}
        {/* <Text style={{ fontSize: 16 }}>
          Đáp án đúng: <strong>{correctAnswer}</strong>
        </Text> */}
      </Card>
    </div>
  );
};

export default AnswerResult;
