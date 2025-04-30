import React, { useState, useEffect } from "react";
import {
  InputNumber,
  notification,
  Upload,
  Checkbox,
  Button,
  Popover,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { createQuestion } from "../services/createQuestion.js";
import { useNavigate } from "react-router-dom"; // Add this for navigation
import "../components/CreateQuestion.css";

const CreateQuestion = () => {
  const navigate = useNavigate(); // Initialize navigate
  const quizId = localStorage.getItem("quizId");
  const [answers, setAnswers] = useState([
    { id: "0", content: "", isAnswer: false },
  ]);
  const [question, setQuestion] = useState({
    id: Date.now(),
    content: "",
    file: null,
    answers: [],
    timeLimitSec: 30,
  });

  const [savedQuestions, setSavedQuestions] = useState(() => {
    if (!quizId) return [];
    const saved = localStorage.getItem(`savedQuestions_${quizId}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (quizId) {
      localStorage.setItem(
        `savedQuestions_${quizId}`,
        JSON.stringify(savedQuestions)
      );
    }
  }, [savedQuestions, quizId]);

  // ... (keep all other functions like handleAddAnswer, handleToggleCheckbox, etc. unchanged)

  const handleSaveQuizz = async () => {
    const quizId = localStorage.getItem("quizId");

    if (!quizId) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy Quiz ID trong localStorage.",
        placement: "topRight",
      });
      return;
    }

    if (!savedQuestions || savedQuestions.length === 0) {
      notification.warning({
        message: "Cảnh báo",
        description: "Bạn chưa có câu hỏi nào!",
        placement: "topRight",
      });
      return;
    }

    const formattedQuestions = savedQuestions.map((q, index) => ({
      questionText: q.content,
      timeLimitSec: q.timeLimitSec === undefined ? 30 : q.timeLimitSec,
      isRandomAnswer: true,
      answers: q.answers.map((a) => ({
        answerText: a.content,
        isCorrect: a.isAnswer,
      })),
    }));

    try {
      const res = await createQuestion(formattedQuestions);
      console.log("✅ API Response:", res);
      await Swal.fire({
        title: "Success!",
        text: "Lưu Quizz thành công !",
        icon: "success",
        confirmButtonColor: "green",
      });
      // Navigate to CreateSession with quizId
      navigate("/create-session", { state: { quizId } });
    } catch (error) {
      console.error("❌ Error saving questions:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu câu hỏi.",
        placement: "topRight",
      });
    }
  };

  // ... (keep the rest of the component unchanged, including the return JSX)
  return <div style={{ padding: "20px" }}>{/* Existing JSX */}</div>;
};

export default CreateQuestion;
