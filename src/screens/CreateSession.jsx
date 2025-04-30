import React, { useState } from "react";
import { Card, Typography, Input, Button, Form, Space, message } from "antd";
import { PlusCircleOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate

const { Title, Text } = Typography;
const token = localStorage.getItem("token");

const CreateSession = ({ onCreate }) => {
  const { state } = useLocation(); // Get navigation state
  const quizId = state?.quizId || localStorage.getItem("quizId"); // Use state or fallback to localStorage
  const navigate = useNavigate(); // Initialize navigate
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
    if (!sessionName || groups.some((g) => !g.name.trim())) {
      message.error("Vui lòng nhập tên phiên và tên tất cả các nhóm!");
      return;
    }

    if (!quizId) {
      message.error("Không tìm thấy Quiz ID!");
      return;
    }

    try {
      const sessionRes = await axios.post(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session",
        {
          quizId: parseInt(quizId), // Ensure quizId is an integer
          sessionName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sessionCode = sessionRes.data?.data?.sessionCode;

      if (!sessionCode) {
        throw new Error("Không nhận được sessionCode từ API!");
      }

      // Store sessionCode in localStorage
      localStorage.setItem("sessionCode", sessionCode);

      // Create teams
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
      navigate("/group-list");
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
            Fill in the details to start your game session for Quiz ID:{" "}
            {quizId || "N/A"}!
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
