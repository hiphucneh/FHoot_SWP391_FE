import React, { Component } from "react";
import { Table, Card, Typography, Spin, message } from "antd";
import { TrophyOutlined, FireOutlined, TeamOutlined } from "@ant-design/icons";
import axios from "axios";
import "./leaderboard.css";

const { Title } = Typography;
const sessionCode = 598826;

class LeaderBoard extends Component {
    state = {
        teams: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchTeams();
    }

    fetchTeams = async () => {
        this.setState({ loading: true, error: null });
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/session/${sessionCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.statusCode === 200) {
                const sortedTeams = [...response.data.data].sort(
                    (a, b) => b.totalScore - a.totalScore
                );
                this.setState({ teams: sortedTeams });
            } else {
                throw new Error(response.data.message || "Failed to fetch teams");
            }
        } catch (error) {
            this.setState({ error: error.message });
            message.error("Không thể tải bảng xếp hạng");
        } finally {
            this.setState({ loading: false });
        }
    };

    getRankAvatar = (rank) => {
        switch (rank) {
            case 1: return "👑";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return "🎯";
        }
    };

    getRankColor = (rank) => {
        switch (rank) {
            case 1: return { background: "#ffd700", color: "#000" };
            case 2: return { background: "#c0c0c0", color: "#000" };
            case 3: return { background: "#cd7f32", color: "#000" };
            default: return { background: "#f0f2f5", color: "#000" };
        }
    };

    renderTeamMembers = (players) => (
        <div style={{ paddingLeft: "46px", paddingBottom: "10px" }}>
            {players.map((player) => (
                <div
                    key={player.playerId}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                        padding: "8px",
                        background: "#f9f9f9",
                        borderRadius: "8px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <img
                        src={player.imageUrl || "https://via.placeholder.com/40"}
                        alt={player.name}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "12px",
                            objectFit: "cover",
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: "500" }}>{player.name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                            Điểm: {player.score} | Tham gia: {new Date(player.joinedAt).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { teams, loading, error } = this.state;

        if (loading) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}>
                    <Spin size="large" tip="Đang tải bảng xếp hạng..." />
                </div>
            );
        }

        if (error) {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    color: "#ff4d4f"
                }}>
                    <Title level={4}>⚠️ {error}</Title>
                </div>
            );
        }

        return (
            <div
                style={{
                    background: "linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)",
                    minHeight: "100vh",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card
                    style={{
                        width: "80%",
                        maxWidth: "800px",
                        borderRadius: "20px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                        overflow: "hidden",
                        border: "none",
                    }}
                    bodyStyle={{ padding: "0" }}
                >
                    <div
                        style={{
                            background: "linear-gradient(90deg, #ff6b6b 0%, #ff8e53 100%)",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        <Title level={2} style={{ color: "#fff", margin: 0 }}>
                            <TrophyOutlined /> BẢNG XẾP HẠNG <FireOutlined />
                        </Title>
                        <div style={{ color: "#fff", marginTop: "8px" }}>
                            <TeamOutlined /> Mã phiên: {sessionCode}
                        </div>
                    </div>

                    <Table
                        dataSource={teams.map((team, index) => ({
                            ...team,
                            rank: index + 1,
                        }))}
                        rowKey="teamId"
                        pagination={false}
                        showHeader={false}
                        style={{ width: "100%" }}
                        rowClassName={(record) => (record.rank <= 3 ? "highlight-row" : "")}
                        expandable={{
                            expandedRowRender: (team) => this.renderTeamMembers(team.players),
                            rowExpandable: (team) => team.players.length > 0,
                        }}
                    >
                        <Table.Column
                            title="Rank"
                            dataIndex="rank"
                            key="rank"
                            render={(rank) => (
                                <div
                                    style={{
                                        display: "inline-block",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        ...this.getRankColor(rank),
                                        textAlign: "center",
                                        lineHeight: "30px",
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                    }}
                                >
                                    {rank}
                                </div>
                            )}
                        />
                        <Table.Column
                            title="Team"
                            dataIndex="teamName"
                            key="teamName"
                            render={(teamName, record) => (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span
                                        style={{
                                            fontSize: "24px",
                                            marginRight: "10px",
                                            width: "30px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {this.getRankAvatar(record.rank)}
                                    </span>
                                    <div>
                                        <div style={{ fontWeight: "bold" }}>{teamName}</div>
                                        <div style={{ fontSize: "12px", color: "#666" }}>
                                            {record.players.length} thành viên
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                        <Table.Column
                            title="Score"
                            dataIndex="totalScore"
                            key="totalScore"
                            render={(score) => (
                                <div
                                    style={{
                                        background: "#ff6b6b",
                                        color: "#fff",
                                        padding: "5px 15px",
                                        borderRadius: "20px",
                                        fontWeight: "bold",
                                        minWidth: "80px",
                                        textAlign: "center",
                                    }}
                                >
                                    {score} pts
                                </div>
                            )}
                        />
                    </Table>

                    <div
                        style={{
                            background: "#f0f2f5",
                            padding: "15px",
                            textAlign: "center",
                            fontStyle: "italic",
                            color: "#666",
                        }}
                    >
                        {teams.length > 0
                            ? "Chúc mừng các đội chiến thắng! 🎉"
                            : "Chưa có đội nào tham gia"}
                    </div>
                </Card>
            </div>
        );
    }
}

export default LeaderBoard;
