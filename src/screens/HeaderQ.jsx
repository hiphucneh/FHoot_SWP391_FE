import React, { useState } from "react";
import { Button, Modal, Input, Select, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./HeaderQ.module.css";
import logo from "../assets/Kahoot_logo.png";
import geminiLogo from "../assets/gemini.png"; // logo AI mới

const { Option } = Select;

const HeaderQ = ({ onSave, setFlag }) => {
  const navigate = useNavigate();
  const quizTitle = localStorage.getItem("quizTitle") || "Untitled Quiz";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [numberOfAnswers, setNumberOfAnswers] = useState(2);
  const [generatedQuiz, setGeneratedQuiz] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleExit = () => navigate("/your-kahoots");
  const handleLogoClick = () => navigate("/Home");

  const handleCancel = () => {
    setIsModalVisible(false);
    setTopic("");
    setDifficultyLevel("Easy");
    setNumberOfQuestions(1);
    setNumberOfAnswers(2);
    setGeneratedQuiz([]);
  };

  const handleToggleQuestion = (question) => {
    setSelectedQuestions((prev) => {
      const exists = prev.find((q) => q.question === question.question);
      return exists
        ? prev.filter((q) => q.question !== question.question)
        : [...prev, question];
    });
  };

  const handleRegenerate = () => {
    handleSaveAIConfig();
    setSelectedQuestions([]);
  };

  const handleSaveAIConfig = async () => {
    if (!topic) {
      notification.error({ message: "Topic is required!" });
      return;
    }

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("difficultyLevel", difficultyLevel);
    formData.append("numberOfQuestions", numberOfQuestions);
    formData.append("numberOfAnswers", numberOfAnswers);

    try {
      const response = await axios.post(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/generate-ai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        notification.success({ message: "AI Quiz Created!" });
        setGeneratedQuiz(response.data.data);
      } else {
        notification.error({
          message: "Error creating quiz",
          description: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      notification.error({
        message: "API Error",
        description: "Failed to generate quiz.",
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left} onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2 className={styles.title}>{quizTitle}</h2>
      </div>

      <div className={styles.right}>
        <Button className={styles.aiButton} onClick={() => setIsModalVisible(true)}>
          <img src={geminiLogo} alt="AI" className={styles.aiIcon} />
          Create with AI
        </Button>
        <Button className={styles.button} onClick={handleExit}>
          Exit
        </Button>
        <Button type="primary" className={styles.button} onClick={onSave}>
          Save
        </Button>
      </div>

      <Modal
        title="Create Quiz with AI"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className={styles.aiModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.formField}>
            <label>Topic</label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div className={styles.formField}>
            <label>Difficulty Level</label>
            <Select
              value={difficultyLevel}
              onChange={(val) => setDifficultyLevel(val)}
              style={{ width: "100%" }}
            >
              <Option value="VeryEasy">Very Easy</Option>
              <Option value="Easy">Easy</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Hard">Hard</Option>
              <Option value="VeryHard">Very Hard</Option>
            </Select>
          </div>

          <div className={styles.formField}>
            <label>Number of Questions</label>
            <Input
              type="number"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              min={1}
            />
          </div>

          <div className={styles.formField}>
            <label>Number of Answers</label>
            <Select
              value={numberOfAnswers}
              onChange={(val) => setNumberOfAnswers(val)}
              style={{ width: "100%" }}
            >
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
            </Select>
          </div>

          <div className={styles.modalFooter}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSaveAIConfig}>
              Create Quiz
            </Button>
          </div>

          {generatedQuiz.length > 0 && (
            <div className={styles.generatedQuiz}>
              <h3>Generated Questions</h3>
              <div className={styles.modalActions}>
                <Button onClick={handleRegenerate}>🔄 Regenerate</Button>
                <Button
                  type="primary"
                  disabled={selectedQuestions.length === 0}
                  onClick={() => {
                    const formatted = selectedQuestions.map((q, i) => ({
                      id: Date.now() + i,
                      content: q.question,
                      file: null,
                      timeLimitSec: 30,
                      answers: q.options.map((opt, j) => ({
                        id: Date.now() + i + j,
                        content: opt,
                        isAnswer: opt === q.correctAnswer,
                      })),
                    }));

                    const quizId = localStorage.getItem("quizId");
                    const existing =
                      JSON.parse(localStorage.getItem(`savedQuestions_${quizId}`)) || [];
                    const updated = [...existing, ...formatted];
                    localStorage.setItem(
                      `savedQuestions_${quizId}`,
                      JSON.stringify(updated)
                    );
                    notification.success({ message: "Questions added" });
                    setIsModalVisible(false);
                    setSelectedQuestions([]);
                    setGeneratedQuiz([]);
                    setFlag((prev) => !prev);
                  }}
                >
                  Add Selected Questions
                </Button>
              </div>

              {generatedQuiz.map((q, i) => (
                <div key={i} className={styles.questionCard}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.some((sel) => sel.question === q.question)}
                      onChange={() => handleToggleQuestion(q)}
                    />
                    <strong>Q{i + 1}:</strong> {q.question}
                  </label>
                  <ul>
                    {q.options.map((opt, j) => (
                      <li key={j} style={{ color: opt === q.correctAnswer ? "green" : "black" }}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
};

export default HeaderQ;
