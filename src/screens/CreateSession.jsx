import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  message,
  Form,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CreateSession.module.css";

const { Title, Text } = Typography;

const CreateSession = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const quizId = state?.quizId || localStorage.getItem("quizId");

  const [quizTitle, setQuizTitle] = useState("Kahoot Session");
  const [groups, setGroups] = useState([
    { id: Date.now(), name: "" },
    { id: Date.now() + 1, name: "" },
  ]);

  useEffect(() => {
    if (!state?.quizTitle && quizId) {
      axios
        .get(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const title = res.data?.data?.title;
          if (title) setQuizTitle(title);
        })
        .catch(() => message.error("Failed to fetch quiz info."));
    } else if (state?.quizTitle) {
      setQuizTitle(state.quizTitle);
    }
  }, [quizId, state, token]);

  const handleGroupNameChange = (id, value) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
  };

  const handleAddGroup = () => {
    if (groups.length >= 4) {
      return message.warning("Maximum 4 groups allowed.");
    }
    setGroups([...groups, { id: Date.now(), name: "" }]);
  };

  const handleDeleteGroup = (id) => {
    if (groups.length <= 2) {
      return message.warning("At least 2 groups are required.");
    }
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSubmit = async () => {
    if (groups.some((g) => !g.name.trim())) {
      return message.error("Please enter all group names!");
    }

    try {
      const sessionRes = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session`,
        { quizId: parseInt(quizId), sessionName: quizTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionCode = sessionRes.data?.data?.sessionCode;
      if (!sessionCode) throw new Error();

      localStorage.setItem("sessionCode", sessionCode);

      await Promise.all(
        groups.map((g) =>
          axios.post(
            `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/team`,
            { sessionCode, teamName: g.name },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      message.success("🎉 Session and groups created!");
      navigate("/group-list");
    } catch {
      message.error("❌ Error creating session or groups!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Text type="secondary">Quiz ID: <strong>{quizId}</strong></Text>
          <Title level={2} className={styles.quizTitle}>{quizTitle}</Title>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Groups">
            <div className={styles.groupContainer}>
              {groups.map((g, idx) => (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="delete"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteGroup(g.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["contextMenu"]}
                  key={g.id}
                >
                  <div className={styles.groupBox}>
                    <Input
                      placeholder={`Group ${idx + 1}`}
                      value={g.name}
                      onChange={(e) =>
                        handleGroupNameChange(g.id, e.target.value)
                      }
                      size="large"
                      className={styles.groupInput}
                    />
                  </div>
                </Dropdown>
              ))}
            </div>
            <Button
              type="dashed"
              icon={<PlusCircleOutlined />}
              onClick={handleAddGroup}
              disabled={groups.length >= 4}
              block
              style={{ marginTop: 16 }}
            >
              Add Group
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className={styles.holdButton}
              size="large"
              block
            >
              🎮 Hold the Game NOW!
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateSession;
