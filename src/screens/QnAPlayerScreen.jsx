import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import useSignalR from "../hooks/useSignalR";
import LeaderBoardScreen from "./LeaderboardScreen";

const { Title } = Typography;

const QnAPlayerScreen = () => {
  const location = useLocation();
  const { sessionCode, firstQuestion } = location.state || {};

  const [questions, setQuestions] = useState(() =>
    firstQuestion ? [firstQuestion] : []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [pendingResults, setPendingResults] = useState(null);
  const [displayResults, setDisplayResults] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [tempPoint, setTempPoint] = useState(0);

  const currentQuestionData = questions[currentQuestionIndex] || null;
  const currentQuestion = currentQuestionData?.question || {};
  const timeLimitSec =
    currentQuestion?.timeLimitSec || currentQuestionData?.timeLimitSec || 10;
  const [timeLeft, setTimeLeft] = useState(() =>
    timeLimitSec ? timeLimitSec : 10
  );
  const questionText = currentQuestion?.questionText || "Không có câu hỏi";
  const imgUrl = currentQuestion?.imgUrl;
  const answers = currentQuestion?.answers || [];
  const shuffledAnswers = currentQuestion?.isRandomAnswer
    ? [...answers].sort(() => Math.random() - 0.5)
    : answers;

  const answerColors = ["#60a5fa", "#f472b6", "#fcd34d", "#93c5fd"];

  useEffect(() => {
    setTimeLeft(timeLimitSec);
    setSelectedAnswer(null);
    setPendingResults(null);
    setDisplayResults(null);
    setShowLeaderboard(false);
  }, [currentQuestionIndex, timeLimitSec]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showLeaderboard) {
      setDisplayResults(pendingResults);
      setShowLeaderboard(true);
      setScore((prev) => prev + tempPoint);
    }
  }, [timeLeft, showLeaderboard, pendingResults]);

  const handleAnswer = async (answer) => {
    if (selectedAnswer) return;
    console.log("cur" + currentQuestionIndex);
    setSelectedAnswer(answer.answerId);

    try {
      const formData = new FormData();
      formData.append("sessionCode", sessionCode);
      formData.append(
        "questionSessionId",
        currentQuestionData.questionSessionId || 0
      );
      formData.append("answerId", answer.answerId);

      const response = await axios.post(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/player/answer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        const isCorrect = response.data.data?.isCorrect || answer.isCorrect;
        setPendingResults({ answerId: answer.answerId, isCorrect });
        const points = isCorrect ? response.data.data?.score : 0;
        setTempPoint(points);
        message.success(`Your Answer: ${answer.answerText}`);
      } else {
        throw new Error(response.data.message || "Error submitting answer");
      }
    } catch (error) {
      console.error("Error submitting answer", error);
      message.error("Cannot submit answer. Please try again.");
      setSelectedAnswer(null);
    }
  };

  const handleNextQuestionSignalR = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestionIndex((prev) => prev + 1);

    setShowLeaderboard(false);
    setTimeLeft(timeLimitSec);
  };

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onNextQuestion: handleNextQuestionSignalR,
  });

  useEffect(() => {
    const joinSessionIfConnected = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
          console.log("📥 Joined session:", sessionCode);
        } catch (err) {
          console.error("❌ Failed to join session:", err);
          message.error("Không thể tham gia phiên. Vui lòng thử lại.");
        }
      }
    };

    const timer = setTimeout(joinSessionIfConnected, 1000);
    return () => clearTimeout(timer);
  }, [connectionRef, sessionCode]);

  if (questions.length === 0) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #bae6fd, #f3d4e5, #fef3c7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', 'Poppins', sans-serif",
        }}
      >
        <Title level={2} style={{ color: "#1e3a8a" }}>
          Đang chờ câu hỏi...
        </Title>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <LeaderBoardScreen
        sessionCode={sessionCode}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        showControls={false}
      />
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #bae6fd, #f3d4e5, #fef3c7)",
        padding: "1rem",
        fontFamily: "'Inter', 'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#1e3a8a",
          margin: "0 0 1.5rem",
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          lineHeight: 1.2,
        }}
      >
        {questionText}
      </Title>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1400px",
          marginBottom: "2rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#3b82f6",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            flexShrink: 0,
          }}
        >
          {timeLeft}
        </div>

        {imgUrl && (
          <div
            style={{
              minWidth: "300px",
              width: "400px",
              height: "250px",
              borderRadius: "0.75rem",
              overflow: "hidden",
              background: "#fff",
              border: "2px solid #60a5fa",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              flexShrink: 0,
            }}
          >
            <img
              src={imgUrl}
              alt="Question visual"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <div
          style={{
            minWidth: "120px",
            padding: "0.75rem",
            background: "#ec4899",
            color: "#fff",
            textAlign: "center",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            flexShrink: 0,
          }}
        >
          {score}
          <br />
          Points
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.ceil(
            shuffledAnswers.length / 2
          )}, minmax(250px, 1fr))`,
          gridTemplateRows: `repeat(${Math.ceil(
            shuffledAnswers.length / 2
          )}, auto)`,
          gap: "1rem",
          width: "100%",
          maxWidth: "1400px",
        }}
      >
        {shuffledAnswers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.answerId;
          const isCorrect = answer.isCorrect;
          const showResult = displayResults !== null;
          const resultColor = showResult
            ? isCorrect
              ? "#4caf50"
              : "#f44336"
            : answerColors[index % answerColors.length];

          return (
            <div
              key={answer.answerId}
              onClick={() => handleAnswer(answer)}
              style={{
                backgroundColor: resultColor,
                padding: "1.5rem 2rem",
                borderRadius: "0.75rem",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "1.5rem",
                textAlign: "center",
                cursor: selectedAnswer ? "default" : "pointer",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(0, 0, 0, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                minHeight: "80px",
                animation: isSelected ? "pulse 0.5s" : "none",
              }}
              onMouseEnter={(e) => {
                if (!selectedAnswer) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedAnswer) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              {answer.answerText}
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default QnAPlayerScreen;
