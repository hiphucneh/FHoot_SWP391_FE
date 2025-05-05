import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Space, Spin, Button, Tag } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const LeaderBoardScreen = ({
  sessionCode,
  onNextQuestion,
  currentQuestionIndex,
  totalQuestions,
  showControls = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log("currentQuestionIndex", currentQuestionIndex);
  console.log("totalQuestions", totalQuestions);
  console.log(currentQuestionIndex < totalQuestions);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const teams = response.data.data.map((team) => ({
          teamId: team.teamId,
          teamName: team.teamName,
          score: team.totalScore,
          rank: team.rank,
          players: team.players.map((player) => ({
            playerId: player.playerId,
            playerName: player.name,
            score: player.totalScore,
          })),
        }));

        setData(teams);
      } catch (error) {
        console.error("Lỗi khi fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sessionCode]);

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank) => {
        if (rank === 1) return <Tag color="gold">🥇</Tag>;
        if (rank === 2) return <Tag color="silver">🥈</Tag>;
        if (rank === 3) return <Tag color="volcano">🥉</Tag>;
        return <Tag>{rank}</Tag>;
      },
      align: "center",
    },
    {
      title: "Team",
      dataIndex: "teamName",
      key: "teamName",
      render: (text) => (
        <Text strong style={{ color: "#d81b60", fontSize: 16 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Text style={{ color: "#ff4081", fontWeight: "bold", fontSize: 16 }}>
          {score}
        </Text>
      ),
      align: "center",
    },
  ];

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
      }}
    >
      <Space direction="vertical" size="large" align="center">
        <Title
          level={2}
          style={{
            color: "#fff",
            textShadow: "1px 1px 6px rgba(0,0,0,0.4)",
            animation: "pulse 2s infinite",
            marginBottom: 0,
          }}
        >
          🏆 LEADER BOARD 🏆
        </Title>

        <Card
          style={{
            width: "90vw",
            maxWidth: 600,
            borderRadius: 16,
            boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            padding: 16,
            background: "rgba(255,255,255,0.95)",
            border: "2px solid #d81b60",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 24 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="teamId"
              pagination={false}
              bordered
              rowClassName={(record) =>
                record.rank === 1
                  ? "gold-row"
                  : record.rank === 2
                    ? "silver-row"
                    : record.rank === 3
                      ? "bronze-row"
                      : ""
              }
              expandable={{
                expandedRowRender: (record) => {
                  const players = record.players || [];

                  return players.length > 0 ? (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#fafafa",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          color: "#d81b60",
                          display: "block",
                          marginBottom: 12,
                        }}
                      >
                        Players in {record.teamName}
                      </Text>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {players.map((player) => (
                          <div
                            key={player.playerId || player.playerName}
                            style={{
                              background: "#ffffff",
                              padding: "12px",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              border: "1px solid #f0f0f0",
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 14,
                                color: "#333",
                              }}
                            >
                              {player.playerName}
                            </Text>
                            <Tag
                              color="pink"
                              style={{
                                fontWeight: "bold",
                                fontSize: 12,
                                padding: "4px 8px",
                              }}
                            >
                              {player.score} pts
                            </Tag>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Text
                      type="secondary"
                      style={{ padding: "12px 16px", display: "block" }}
                    >
                      No players in this team.
                    </Text>
                  );
                },
                rowExpandable: (record) => (record.players || []).length > 0,
              }}
            />
          )}
        </Card>

        {showControls &&
          (currentQuestionIndex < totalQuestions ? (
            <Button
              onClick={onNextQuestion}
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
              Next Question
            </Button>
          ) : (
            <Button
              onClick={async () => {
                try {
                  await axios.post(
                    `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/finish`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  localStorage.removeItem("sessionCode");
                  alert(
                    "Session finished! Redirecting to create session page..."
                  );
                  window.location.href = "/create-session";
                } catch (error) {
                  console.error("Lỗi khi kết thúc phiên:", error);
                }
              }}
              size="large"
              style={{
                backgroundColor: "#ff4081",
                borderColor: "#ff4081",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              🛑 End Session
            </Button>
          ))}

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
          .gold-row {
            background: #fff8dc !important;
          }
          .silver-row {
            background: #f0f0f0 !important;
          }
          .bronze-row {
            background: #fbe7d0 !important;
          }
          .ant-table-thead > tr > th {
            background: #d81b60 !important;
            color: #fff !important;
            font-weight: 600 !important;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default LeaderBoardScreen;