import React, { useState } from "react";
import { Button, Modal, Input, Select, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import styles from "./HeaderQ.module.css";
import logo from "../assets/FhootLogo.png";

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

  const handleExit = () => {
    navigate("/");
  };

  const handleCreateWithAI = () => {
    setIsModalVisible(true);
  };

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
      if (exists) {
        return prev.filter((q) => q.question !== question.question);
      } else {
        return [...prev, question];
      }
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
        notification.success({
          message: "AI Quiz Created!",
        });
        console.log("Generated Quiz:", response.data.data);
        setGeneratedQuiz(response.data.data);
      } else {
        notification.error({
          message: "Error creating quiz",
          description:
            response.data.message ||
            "An error occurred while creating the quiz.",
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
      notification.error({
        message: "API Error",
        description:
          "An error occurred while calling the API. Please try again.",
      });
    }
  };

  return (

    <header className={styles.header} style={{ height: "80px" }}>
      <div className={styles.left}>
        <img src={logo} alt="Kahoot Logo" className={styles.logo} />
        <h2 className={styles.title}>{quizTitle}</h2>
      </div>
      <div className={styles.right}>
        <Button onClick={handleCreateWithAI} className={styles.aiButton}>
          Create with AI
        </Button>
        <Button onClick={handleExit} className={styles.button}>
          Exit
        </Button>
        <Button type="primary" onClick={onSave} className={styles.button}>
          Save
        </Button>
      </div>

      <Modal
        title="Create Quiz with AI"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className={styles.aiModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.formField}>
            <label>Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter quiz topic"
            />
          </div>

          <div className={styles.formField}>
            <label>Difficulty Level</label>
            <Select
              value={difficultyLevel}
              onChange={(value) => setDifficultyLevel(value)}
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
              onChange={(value) => setNumberOfAnswers(value)}
              style={{ width: "100%" }}
            >
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
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
              <h3>Generated Quiz</h3>
              <div className={styles.modalActions}>
                <Button
                  onClick={handleRegenerate}
                  type="default"
                  style={{ marginRight: 8 }}
                >
                  🔄 Generate Again
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    const formattedQuestions = selectedQuestions.map(
                      (q, index) => ({
                        id: Date.now() + index,
                        content: q.question,
                        file: null,
                        timeLimitSec: 30,
                        answers: q.options.map((opt, idx) => ({
                          id: Date.now() + index + idx,
                          content: opt,
                          isAnswer: opt === q.correctAnswer,
                        })),
                      })
                    );

                    const existingQuestions =
                      JSON.parse(
                        localStorage.getItem(
                          `savedQuestions_${localStorage.getItem("quizId")}`
                        )
                      ) || [];
                    const updatedQuestions = [
                      ...existingQuestions,
                      ...formattedQuestions,
                    ];
                    localStorage.setItem(
                      `savedQuestions_${localStorage.getItem("quizId")}`,
                      JSON.stringify(updatedQuestions)
                    );
                    console.log(existingQuestions);

                    notification.success({
                      message: "Questions Added",
                      description:
                        "Selected questions have been added to the quiz.",
                    });
                    setIsModalVisible(false);
                    setGeneratedQuiz([]);
                    setSelectedQuestions([]);
                    const quizId = localStorage.getItem("quizId");
                    const saved = localStorage.getItem(
                      `savedQuestions_${quizId}`
                    );
                    console.log(saved + "saved");
                    console.log(updatedQuestions + "updated");

                    setFlag((prev) => !prev);
                  }}
                  disabled={selectedQuestions.length === 0}
                >
                  Add Selected Questions
                </Button>
              </div>

              {generatedQuiz.map((q, index) => (
                <div key={index} className={styles.questionCard}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.some(
                        (selected) => selected.question === q.question
                      )}
                      onChange={() => handleToggleQuestion(q)}
                      style={{ marginRight: 8 }}
                    />
                    <strong>Question {index + 1}:</strong> {q.question}
                  </label>
                  <ul>
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: opt === q.correctAnswer ? "green" : "black",
                        }}
                      >
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
