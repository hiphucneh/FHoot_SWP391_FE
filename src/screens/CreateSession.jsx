import React, { useState } from "react";
import { Card, Typography, Input, Button, Form, Space, message } from "antd";
import { PlusCircleOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJUZWFjaGVyIiwiZXhwIjoxNzQ1NDgxNzg2LCJpc3MiOiJLYWhvb3QiLCJhdWQiOiJLYWhvb3QgRW5kIFVzZXJzIn0.uSLQm1uR1j7TLvU0xtcXqs9jsPGMRW9zteO6K3VH_oc";
const CreateSession = ({ onCreate }) => {
  const [sessionName, setSessionName] = useState("");
  const [groups, setGroups] = useState([{ id: Date.now(), name: "" }]);

  const handleGroupNameChange = (id, value) => {
    setGroups((prev) =>
      prev.map((group) => (group.id === id ? { ...group, name: value } : group))
    );
  };

  const handleAddGroup = () => {
    setGroups([...groups, { id: Date.now(), name: "" }]);
  };

  const handleSubmit = async () => {
    if (!sessionName || groups.some((g) => !g.name.trim())) return;

    try {
      const sessionRes = await axios.post(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session",
        {
          quizId: 13,
          sessionName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sessionCode = sessionRes.data?.data?.sessionCode;

      await Promise.all(
        groups.map((group) =>
          axios.post(
            "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team",
            {
              sessionCode,
              teamName: group.name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      message.success("🎉 Tạo phiên chơi và nhóm thành công!");

      if (onCreate) onCreate({ sessionName, sessionCode });
    } catch (error) {
      console.error("Error creating session or teams:", error);
      message.error("❌ Có lỗi xảy ra khi tạo session hoặc nhóm!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "24px",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: "#d81b60", marginBottom: 0 }}>
            <SmileOutlined /> Create a Session
          </Title>
          <Text type="secondary">
            Fill in the details to start your game session!
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Session Name"
            rules={[{ required: true, message: "Please enter a session name" }]}
          >
            <Input
              placeholder="Enter session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Groups">
            <Space direction="vertical" style={{ width: "100%" }}>
              {groups.map((group, index) => (
                <Input
                  key={group.id}
                  placeholder={`Group ${index + 1}`}
                  value={group.name}
                  onChange={(e) =>
                    handleGroupNameChange(group.id, e.target.value)
                  }
                  size="large"
                />
              ))}
              <Button
                type="dashed"
                onClick={handleAddGroup}
                icon={<PlusCircleOutlined />}
                block
              >
                Add Group
              </Button>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
              size="large"
              style={{
                width: "100%",
                backgroundColor: "#d81b60",
                borderColor: "#d81b60",
                fontWeight: "bold",
              }}
            >
              Create Session
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSession;
