import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Card, List, Typography, Tag, Space, Button } from "antd";

const { Title, Text } = Typography;

const MyHistorySession = () => {
  const sessionCode = localStorage.getItem("sessionCode");
  const location = useLocation();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/player/result?sessionCode=${sessionCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data?.statusCode === 200) {
          setHistory(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử:", error);
      }
    };

    if (sessionCode) fetchHistory();
  }, [sessionCode]);

  if (!history) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Title level={2} style={{ color: "#d81b60" }}>
        🧠 My Quiz History
      </Title>

      <Card
        title={`Total Score: ${history.totalScore}`}
        style={{ width: "100%", maxWidth: 600, borderRadius: 12 }}
        headStyle={{
          background: "#f8bbd0",
          color: "#880e4f",
          fontWeight: "bold",
        }}
      >
        <List
          itemLayout="vertical"
          dataSource={history.answers}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Card
                style={{
                  backgroundColor: item.isCorrect ? "#e8f5e9" : "#ffebee",
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    📝 Question #{index + 1}: {item.questionText}
                  </Text>
                  <Text>
                    👉 Your Answer:{" "}
                    <Text
                      strong
                      underline
                      type={item.isCorrect ? "success" : "danger"}
                    >
                      {item.answerText}
                    </Text>
                  </Text>
                  <Text>
                    🧮 Score:{" "}
                    <Tag color={item.isCorrect ? "green" : "red"}>
                      {item.isCorrect ? `+${item.score}` : "Incorrect"}
                    </Tag>
                  </Text>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Button
        onClick={() => {
          localStorage.removeItem("sessionCode");
          window.location.href = "/Home";
        }}
        type="primary"
        size="large"
        style={{
          backgroundColor: "#d81b60",
          borderColor: "#d81b60",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: 16,
          marginTop: "24px",
        }}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default MyHistorySession;
