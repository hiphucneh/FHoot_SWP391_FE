import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useSignalR from "../hooks/useSignalR";
import LeaderboardScreen from "./LeaderboardScreen";

const { Title } = Typography;

const QnAHostScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionCode, totalQuestion } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [flagFirstTimeQuestion, setFlagFirstTimeQuestion] = useState(false);
  const [flagShowLeaderBoard, setFlagShowLeaderBoard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [countAnswer, setCountAnswer] = useState(0);

  const [flagQuestion, setFlagQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagChangeFistTime, setfFlagChangeFistTime] = useState(false);

  const timeLimitSec = currentQuestion?.timeLimitSec || 10;

  const [answers, setAnswers] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [questionText, setQuestionText] = useState("");

  const shuffledAnswers = currentQuestion?.isRandomAnswer
    ? [...answers].sort(() => Math.random() - 0.5)
    : answers;

  const answerColors = ["#60a5fa", "#f472b6", "#fcd34d", "#93c5fd"];

  const handleChangeQuestion = () => {
    setAnswers(currentQuestion?.answers || []);
    setImgUrl(currentQuestion?.imgUrl);
    setQuestionText(currentQuestion?.questionText || "Don't have question");
    console.log(currentQuestion);
  };

  const handleCountAnswer = () => {
    setCountAnswer((prev) => prev + 1);
  };

  useEffect(() => {
    setTimeLeft(timeLimitSec);
    handleChangeQuestion();
  }, [currentQuestionIndex, flagChangeFistTime]);

  useEffect(() => {
    if (sessionCode && questions.length === 0) {
      handleNextQuestion(currentQuestionIndex + 1);
    }
  }, [sessionCode]);

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
      if (response.data.statusCode === 200) {
        setLeaderboardData(response.data.data);
        setShowLeaderboard(true);
      }
    } catch (error) {
      console.error("Fail to fetch leader board", error);
      message.error("Fail to fetch leader board");
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && sessionCode && flagQuestion) {
      console.log("⏰ Time up!");
      fetchLeaderboard();
    }
  }, [timeLeft, sessionCode]);

  const handleNextQuestion = async (sortOrder) => {
    try {
      const response = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/next-question?sortOrder=${sortOrder}&timeLimitSec=${timeLimitSec}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        if (response.data.data) {
          setQuestions((prev) => [...prev, response.data.data]);

          setCurrentQuestionIndex((prev) => prev + 1);

          console.log("currentQuestionIndex", currentQuestionIndex);

          setFlagFirstTimeQuestion(true);
          setShowLeaderboard(false);
          setFlagQuestion(true);
          setCurrentQuestion(response.data.data.question);
          setCountAnswer(0);

          setfFlagChangeFistTime(true);
        } else {
          fetchLeaderboard();
        }
      }
    } catch (error) {
      console.error("Fail to next question", error);
      message.error("Cannot next question. Please try again.");
    }
  };

  const handleAnswerReceived = (data) => {
    setAnswerCount((prev) => prev + 1);
  };

  const handleNextQuestionSignalR = (data) => {
    setQuestions((prev) => [...prev, data]);

    setShowLeaderboard(false);
    setTimeLeft(timeLimitSec);
  };

  const handleShowLeaderboard = () => {
    fetchLeaderboard();
  };

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onNextQuestion: handleNextQuestionSignalR,
    onShowLeaderboard: handleShowLeaderboard,
    onAnswerReceived: handleAnswerReceived,
    onCountAnswer: handleCountAnswer,
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

  if (!questions || questions.length === 0) {
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
          Don't have any question yet.
        </Title>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <LeaderboardScreen
        leaderboardData={leaderboardData}
        sessionCode={sessionCode}
        onNextQuestion={() => handleNextQuestion(currentQuestionIndex + 1)}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestion}
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
          {countAnswer}
          <br />
          Answers
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
        {shuffledAnswers.map((answer, index) => (
          <div
            key={answer.answerId}
            style={{
              backgroundColor: answerColors[index % answerColors.length],
              padding: "1.5rem 2rem",
              borderRadius: "0.75rem",
              color: "#1e293b",
              fontWeight: 600,
              fontSize: "1.5rem",
              textAlign: "center",
              cursor: "default",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              minHeight: "80px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}
          >
            {answer.answerText}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QnAHostScreen;
