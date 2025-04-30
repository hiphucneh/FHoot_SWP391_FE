import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Input,
  Upload,
  Button,
  Avatar,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ChooseGroupScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const sessionCode = localStorage.getItem("sessionCode");
      console.log("Using sessionCode from localStorage:", sessionCode);

      if (!sessionCode) {
        message.error("Session code not found. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/session/${sessionCode}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API response:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          const groupData = response.data.data.map((team) => ({
            id: team.teamId,
            name: team.teamName,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          }));
          console.log("Groups to render:", groupData);
          setGroups(groupData);
        } else {
          message.error("No groups found for this session.");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        message.error("Failed to fetch groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (teamId) => {
    setSelectedTeamId(teamId);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!fullName) {
      message.error("Please enter your full name.");
      return;
    }

    const sessionCode = localStorage.getItem("sessionCode");
    if (!sessionCode) {
      message.error("Session code not found. Please try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("teamId", selectedTeamId);
      formData.append("fullName", fullName);
      if (imageFile) {
        formData.append("imageUrl", imageFile);
      }
      console.log("Form Data:", {
        teamId: selectedTeamId,
        fullName: fullName,
        imageFile: imageFile,
      });

      const response = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team/${sessionCode}/join`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        message.success("Successfully joined the team!");
        setIsModalVisible(false);
        setFullName("");
        setImageFile(null);
        console.log(selectedTeamId);

        navigate("/waiting-room", {
          state: { teamId: selectedTeamId },
        });
      } else {
        message.error("Failed to join the team. Please try again.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      console.log("Error response:", error.response);

      message.error(
        error.response?.data?.message ||
          "Failed to join the team. Please try again."
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFullName("");
    setImageFile(null);
  };

  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setImageFile(file);
    return false;
  };

  const imagePreviewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return null;
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #00f2fe, #ff6ec4, #f9cb28)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
        fontFamily: "'Inter', 'Poppins', sans-serif",
      }}
    >
      <Title
        level={2}
        style={{
          color: "#fff",
          marginBottom: "2rem",
          textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        Choose Your Group
      </Title>

      {loading ? (
        <Spin size="large" style={{ marginTop: "4rem" }} />
      ) : (
        <Row
          gutter={[24, 24]}
          justify="center"
          style={{ width: "100%", maxWidth: "1000px" }}
        >
          {groups.length > 0 ? (
            groups.map((group) => (
              <Col xs={24} sm={12} md={8} lg={6} key={group.id}>
                <Card
                  hoverable
                  onClick={() => handleGroupClick(group.id)}
                  style={{
                    backgroundColor: "#ffffff33",
                    borderRadius: "1rem",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {group.name}
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Typography.Text style={{ color: "#fff" }}>
                No groups available.
              </Typography.Text>
            </Col>
          )}
        </Row>
      )}

      <Modal
        title={
          <Text style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            🚀 Join a Team
          </Text>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Join"
        cancelText="Cancel"
        centered
        style={{ padding: "1.5rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Text strong style={{ display: "block", marginBottom: "0.5rem" }}>
            Full Name *
          </Text>
          <Input
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              borderRadius: "8px",
              padding: "0.6rem",
            }}
          />
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "0.5rem" }}>
            Profile Image (Optional)
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Avatar
              size={64}
              src={imagePreviewUrl}
              icon={!imagePreviewUrl && <UserOutlined />}
              style={{ border: "1px solid #d9d9d9", flexShrink: 0 }}
            />
            <Upload
              beforeUpload={handleImageUpload}
              maxCount={1}
              accept="image/*"
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                style={{ borderRadius: "8px", padding: "0.4rem 1rem" }}
              >
                Choose Image
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChooseGroupScreen;
