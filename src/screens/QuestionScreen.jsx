import React, { useState } from "react";
import { Button, Countdown } from "antd";

const QuestionScreen = () => {
  const question = "What is the capital of France?";
  const options = ["Berlin", "Madrid", "Paris", "Rome"];
  const correctAnswer = "Paris";
  const timeLimit = 30;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  return (
    <div
      className="question-container"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>{question}</h1>

      <div
        className="options"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            type={
              isAnswered
                ? option === correctAnswer
                  ? "primary"
                  : "dashed"
                : "default"
            }
            size="large"
            style={{
              backgroundColor: isAnswered
                ? option === correctAnswer
                  ? "#4caf50" // xanh cho đúng
                  : option === selectedAnswer
                  ? "#f44336" // đỏ cho sai
                  : ""
                : "",
            }}
            disabled={isAnswered}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="timer" style={{ fontSize: "1.5rem", marginTop: "20px" }}>
        <Countdown
          value={Date.now() + timeLimit * 1000}
          onFinish={() => setIsAnswered(true)}
          format="s"
          style={{ fontSize: "2rem" }}
        />
      </div>
    </div>
  );
};

export default QuestionScreen;