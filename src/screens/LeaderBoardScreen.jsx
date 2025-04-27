import React from 'react';
import { Table, Avatar, Card, Badge } from "antd";
const LeaderBoardScreen = () => {
    const testData = [
        { id: 1, name: 'Player 1', score: 1500 },
        { id: 2, name: 'Player 2', score: 1400 },
        { id: 3, name: 'Player 3', score: 1300 },
        { id: 4, name: 'Player 4', score: 1200 },
        { id: 5, name: 'Player 5', score: 1100 },
    ];

    return (

        <div style={{

            textAlign: "center",
            display: "flex",
            justifyContent: 'center',
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"

        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "50px",
            }}>
                <Card
                    style={{
                        width: 450,
                        padding: 20,
                        borderRadius: 20,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}
                >
                    <h2>🏆 Leaderboard 🏆</h2>
                    <Table
                        dataSource={testData}
                        rowKey="id"
                        pagination={false}
                        bordered
                        style={{ width: "400px" }}
                    >
                        <Table.Column title="Name" dataIndex="name" key="name" />
                        <Table.Column title="Score" dataIndex="score" key="score" />
                    </Table>
                </Card>
            </div>


        </div>
    );
};




export default LeaderBoardScreen;