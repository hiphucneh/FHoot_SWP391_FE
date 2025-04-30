import React, { useState, useEffect } from "react";
import { Typography } from "antd";

const { Title } = Typography;

const answers = [
  { text: "1888", color: "#60a5fa" }, // Xanh lam sáng
  { text: "1905", color: "#f472b6" }, // Hồng sáng
  { text: "1912", color: "#fcd34d" }, // Vàng sáng
  { text: "1942", color: "#93c5fd" }, // Xanh lam trung bình
];

const QnAHostScreen = () => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [answerCount, setAnswerCount] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    setAnswerCount((prev) => prev + 1);
    alert(`You selected: ${answer}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #bae6fd, #f3d4e5, #fef3c7)", // Giữ gradient
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
      {/* Question */}
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#1e3a8a", // Xanh lam đậm hơn, dễ đọc
          margin: "0 0 1.5rem",
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          lineHeight: 1.2,
        }}
      >
        When did the first cornea transplant take place?
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
            background: "#3b82f6", // Xanh lam đậm hơn, dựa trên #bae6fd
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

        <div
          style={{
            minWidth: "300px",
            width: "400px",
            height: "250px",
            borderRadius: "0.75rem",
            overflow: "hidden",
            background: "#fff", // Nền trắng
            border: "2px solid #60a5fa", // Viền xanh lam sáng
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            flexShrink: 0,
          }}
        >
          <img
            src="https://lienquan.garena.vn/wp-content/uploads/2024/05/ea4408de26b25e684372f0298d838837658d3f256a9ce-2.jpg"
            alt="Question visual"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Answer */}
        <div
          style={{
            minWidth: "120px",
            padding: "0.75rem",
            background: "#ec4899", // Hồng đậm hơn, dựa trên #f3d4e5
            color: "#fff",
            textAlign: "center",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            flexShrink: 0,
          }}
        >
          {answerCount}
          Answers
        </div>
      </div>

      {/* Answers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(250px, 1fr))",
          gridTemplateRows: "repeat(2, auto)",
          gap: "1rem",
          width: "100%",
          maxWidth: "1400px",
        }}
      >
        {answers.map((answer, index) => (
          <div
            key={index}
            onClick={() => handleAnswer(answer.text)}
            style={{
              backgroundColor: answer.color, // Sử dụng màu mới từ answers
              padding: "1.5rem 2rem",
              borderRadius: "0.75rem",
              color: "#1e293b", // Xám đậm để chữ nổi bật
              fontWeight: 600,
              fontSize: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
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
            {answer.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QnAHostScreen;
