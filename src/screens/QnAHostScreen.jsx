import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Typography,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useSignalR from "../hooks/useSignalR";
import LeaderboardScreen from "./LeaderBoardScreen";
import styles from "./QnAHostScreen.module.css";
import bgMusic from "../assets/sound/bg-answer.mp3";

const { Title } = Typography;

const QnAHostScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionCode, totalQuestion } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [countAnswer, setCountAnswer] = useState(0);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [flagQuestion, setFlagQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionText, setQuestionText] = useState("");

  const timeLimitSec = currentQuestion?.timeLimitSec || 10;
  const shuffledAnswers = currentQuestion?.isRandomAnswer
    ? [...answers].sort(() => Math.random() - 0.5)
    : answers;

  const bgAudioRef = useRef(null);

  // ✅ Autoplay-safe music init
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.4;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.play().catch(() => {});
    }
  }, []);

  const handleChangeQuestion = () => {
    setAnswers(currentQuestion?.answers || []);
    setQuestionText(currentQuestion?.questionText || "No question available");
  };

  useEffect(() => {
    setTimeLeft(timeLimitSec);
    handleChangeQuestion();
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (sessionCode && questions.length === 0) {
      handleNextQuestion(currentQuestionIndex + 1);
    }
  }, [sessionCode]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.statusCode === 200) {
        setLeaderboardData(res.data.data);
        setShowLeaderboard(true);
      }
    } catch {
      message.error("Failed to fetch leaderboard");
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && sessionCode && flagQuestion) {
      setShowTimeUp(true);
      setTimeout(() => {
        setShowTimeUp(false);
        fetchLeaderboard();
      }, 2000);
    }
  }, [timeLeft, sessionCode]);

  const handleNextQuestion = async (sortOrder) => {
    try {
      const res = await axios.post(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/session/${sessionCode}/next-question?sortOrder=${sortOrder}&timeLimitSec=${timeLimitSec}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.statusCode === 200 && res.data.data) {
        setQuestions((prev) => [...prev, res.data.data]);
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentQuestion(res.data.data.question);
        setFlagQuestion(true);
        setCountAnswer(0);
        setShowLeaderboard(false);
      } else {
        fetchLeaderboard();
      }
    } catch {
      message.error("Cannot load next question.");
    }
  };

  const connectionRef = useSignalR({
    baseHubUrl:
      "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/gamehubs",
    token: localStorage.getItem("token"),
    onNextQuestion: () => {},
    onShowLeaderboard: fetchLeaderboard,
    onAnswerReceived: () => setAnswerCount((prev) => prev + 1),
    onCountAnswer: () => setCountAnswer((prev) => prev + 1),
  });

  useEffect(() => {
    const joinSession = async () => {
      const connection = connectionRef?.current;
      if (connection && connection.state === "Connected") {
        try {
          await connection.invoke("JoinSession", sessionCode);
        } catch {
          message.error("Failed to join session");
        }
      }
    };

    const timer = setTimeout(joinSession, 1000);
    return () => clearTimeout(timer);
  }, [connectionRef, sessionCode]);

  if (!questions.length) {
    return (
      <div className={styles.centered}>
        <Title level={2} className={styles.noQuestionText}>
          No question loaded.
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

  if (showTimeUp) {
    return (
      <div className={styles.centered}>
        <Title level={1} className={styles.timeUp}>⏰ Time’s up!</Title>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <audio ref={bgAudioRef} src={bgMusic} hidden />

      <div className={styles.infoRow}>
        <div className={styles.timerBox}>{timeLeft}</div>
        <div className={styles.answerBox}>
          {countAnswer}
          <br />
          Answers
        </div>
      </div>

      <div className={styles.questionBox}>
        <Title level={2} className={styles.questionText}>
          {questionText}
        </Title>
      </div>

      <div
        className={styles.answerGrid}
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            shuffledAnswers.length / 2
          )}, minmax(250px, 1fr))`,
        }}
      >
        {shuffledAnswers.map((answer, index) => (
          <div
            key={answer.answerId}
            className={styles.answerItem}
            style={{
              backgroundColor: ["#60a5fa", "#f472b6", "#fcd34d", "#34d399"][
                index % 4
              ],
              color: index === 2 ? "#333" : "#fff",
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
