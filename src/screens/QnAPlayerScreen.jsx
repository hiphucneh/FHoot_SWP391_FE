import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useSignalR from "../hooks/useSignalR";
import LeaderBoardScreen from "./LeaderBoardScreen";
import styles from "./QnAPlayerScreen.module.css";

const { Title } = Typography;

const QnAPlayerScreen = () => {
  const location = useLocation();
  const { sessionCode, firstQuestion, teamId } = location.state || {};
  const navigate = useNavigate();

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

  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
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
      setTimeout(() => {
        setShowLeaderboard(true);
        setScore((prev) => prev + tempPoint);
      }, 2000);
    }
  }, [timeLeft, showLeaderboard, pendingResults]);

  const endSession = (data) => {
    navigate("/bingo", { state: { teamDataFinal: data, teamId: teamId } });
  };

  const handleAnswer = async (answer) => {
    if (selectedAnswer) return;
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
        const isCorrect = response.data.data?.isCorrect;
        setPendingResults({
          answerId: response.data.data?.trueAnswer,
          isCorrect: true,
        });

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
    onEndSession: endSession,
  });

  useEffect(() => {
    const joinSessionIfConnected = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
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
      <div className={styles.wrapper}>
        <Title className={styles.questionTitle}>Đang chờ câu hỏi...</Title>
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
    <div className={styles.wrapper}>

      <div className={styles.topBar}>
        <div className={styles.timerBox}>{timeLeft}</div>

        {imgUrl && (
          <div className={styles.imageBox}>
            <img src={imgUrl} alt="Question visual" />
          </div>
        )}

        <div className={styles.scoreBox}>
          {score}
          <br />
          Points
        </div>
      </div>

      <div
  className={styles.answerGrid}
  style={{
    gridTemplateColumns: `repeat(${Math.ceil(
      shuffledAnswers.length / 2
    )}, minmax(250px, 1fr))`,
  }}
>
  {shuffledAnswers.map((answer, index) => {
    const isSelected = selectedAnswer === answer.answerId;
    const isThisSelected = selectedAnswer === answer.answerId;
    const showResult = displayResults !== null;

    const resultColor = showResult
      ? answer.answerId === pendingResults?.answerId
        ? pendingResults.isCorrect
          ? "#4caf50"
          : "#f44336"
        : "#f44336"
      : isThisSelected
      ? "#1e40af"
      : answerColors[index % answerColors.length];

    return (
      <div
        key={answer.answerId}
        onClick={() => handleAnswer(answer)}
        className={styles.answerItem}
        style={{
          backgroundColor: resultColor,
          color: isThisSelected ? "#fff" : "#1e293b",
          fontSize: "2rem",
          padding: "2rem 3rem",
          minHeight: "120px",
          cursor: selectedAnswer ? "default" : "pointer",
          boxShadow: isThisSelected
            ? "0 0 0 4px rgba(30, 64, 175, 0.4)"
            : undefined,
          transform: isThisSelected ? "scale(1.05)" : "none",
          animation: isSelected ? "pulse 0.5s" : "none",
        }}
        onMouseEnter={(e) => {
          if (!selectedAnswer)
            e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          if (!selectedAnswer)
            e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {answer.answerText}
      </div>
    );
  })}
</div>
    </div>
  );
};

export default QnAPlayerScreen;
