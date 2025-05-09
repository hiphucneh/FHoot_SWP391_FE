import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Upload,
  Checkbox,
  Button,
  Select,
  notification,
  Modal,
  Form,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import axios from "axios";
import { updateQuestion } from "../services/updateQuestion";
import HeaderQ from "./HeaderQ";
import styles from "./CreateQuestion.module.css";
import bgImage from "../assets/bg-Q.jpg";
import { useForm } from "antd/es/form/Form";

const { Option } = Select;

const UpdateQuestionScreen = () => {
  const [questionType, setQuestionType] = useState("single");
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.quizId;
  const quizTitle = location.state?.quizTitle;
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiForm] = useForm();
  const initialQuestions = location.state?.questions || [];
  const [aiGeneratedQuestions, setAIGeneratedQuestions] = useState([]);
  const [selectedAIQuestions, setSelectedAIQuestions] = useState([]);
  const token = localStorage.getItem("token");
  console.log(initialQuestions);

  const [flagAIQuestion1, setFlagAIQuestion1] = useState(false);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [questionLengthConfig, setQuestionLengthConfig] = useState({
    min: 1,
    max: 500,
  });
  const [answerLimitConfig, setAnswerLimitConfig] = useState({
    min: 2,
    max: 6,
  });
  const [timeLimitConfig, setTimeLimitConfig] = useState({
    min: 10,
    max: 300,
  });
  async function getConfigData(configId) {
    const url = `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/system-configuration/${configId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(configId);
      console.log(data);
      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const fetchConfigs = async () => {
      const config3 = await getConfigData(3);
      const config4 = await getConfigData(4);
      const config2 = await getConfigData(2);

      if (config3) {
        setQuestionLengthConfig({
          min: config3.minValue,
          max: config3.maxValue,
        });
      }

      if (config4) {
        setAnswerLimitConfig({
          min: config4.minValue,
          max: config4.maxValue,
        });
      }
      if (config2)
        setTimeLimitConfig({
          min: config2.minValue,
          max: config2.maxValue,
        });
    };

    fetchConfigs();
  }, []);

  useEffect(() => {
    const parsed = initialQuestions.map((q) => ({
      id: q.questionId,
      content: q.questionText,
      file: q.imgUrl,
      timeLimitSec: q.timeLimitSec || 30,
      questionType: q.questionType || "single",
      answers: q.answers.map((a) => ({
        id: a.answerId,
        content: a.answerText,
        isAnswer: a.isCorrect,
      })),
    }));
    setSavedQuestions(parsed);

    if (parsed.length > 0) {
      setQuestion(parsed[0]);
      setAnswers(parsed[0].answers);
    }
  }, [initialQuestions]);

  useEffect(() => {
    const isValid =
      question.content?.trim() &&
      answers.length >= 2 &&
      answers.every((a) => a.content?.trim()) &&
      answers.some((a) => a.isAnswer);

    const updated = { ...question, answers };
    const exists = savedQuestions.find((q) => q.id === updated.id);
    if (isValid) {
      if (exists) {
        setSavedQuestions((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        );
      } else {
        setSavedQuestions((prev) => [...prev, updated]);
      }
    }
  }, [answers, question]);

  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      content: "",
      file: null,
      answers: [],
      timeLimitSec: 30,
    };
    setSavedQuestions((prev) => [...prev, newQ]);
    setQuestion(newQ);
    setAnswers([
      { id: Date.now(), content: "", isAnswer: false },
      { id: Date.now() + 1, content: "", isAnswer: false },
    ]);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`savedQuestions_${quizId}`);
    if (saved) {
      setSavedQuestions(JSON.parse(saved));
    }
  }, [flagAIQuestion1]);

  const handleSelectQuestion = (q) => {
    setQuestion(q);
    setQuestionType(q.questionType || "single");
    setAnswers(
      q.answers.length
        ? q.answers
        : [
            { id: Date.now(), content: "", isAnswer: false },
            { id: Date.now() + 1, content: "", isAnswer: false },
          ]
    );
  };

  const handleChangeAnswer = (id, value) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, content: value } : a))
    );
  };

  const handleToggleCheckbox = (id, checked) => {
    setAnswers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isAnswer: checked } : a))
    );
  };

  const handleChangeAnswerCount = (val) => {
    const updated = [...answers];
    while (updated.length < val) {
      updated.push({
        id: Date.now() + updated.length,
        content: "",
        isAnswer: false,
      });
    }
    setAnswers(updated.slice(0, val));
  };

  const handleChangeImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length <= 1) {
          return notification.error({ message: "Import failed: Empty file" });
        }

        const imported = rows.slice(1).map((r, i) => {
          const aCount = [r[1], r[2], r[3], r[4]].filter(Boolean).length;
          return {
            id: Date.now() + i,
            content: r[0] || "",
            file: null,
            timeLimitSec: 30,
            answers: ["A", "B", "C", "D"].slice(0, aCount).map((opt, j) => ({
              id: Date.now() + i + j,
              content: r[j + 1] || "",
              isAnswer: r[5]?.toUpperCase() === opt,
            })),
          };
        });

        setSavedQuestions(imported);
        setQuestion(imported[0]);
        setAnswers(imported[0].answers);
      } catch {
        notification.error({ message: "Invalid Excel format" });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGenerateAIAnswers = async () => {
    if (!question.content?.trim()) {
      notification.warning({ message: "Please enter a question first" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", question.content);

      const res = await axios.post(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/generate-answer-ai",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) throw new Error("Failed to generate answers");

      const { data } = res.data;
      const newAnswers = data.options.map((opt, index) => ({
        id: Date.now() + index,
        content: opt,
        isAnswer: opt === data.correctAnswer,
      }));

      setAnswers(newAnswers);
      notification.success({ message: "AI Answers Generated Successfully!" });
    } catch (err) {
      notification.error({ message: "Failed to generate AI answers" });
    }
  };

  const handleUpdateQuiz = async () => {
    if (!quizId || savedQuestions.length === 0) {
      return notification.warning({ message: "No questions to update" });
    } else if (savedQuestions.some((q) => !q.content?.trim())) {
      return notification.error({
        message: "Can't update yet!",
        description: "Still have null question.",
      });
    }

    const payload = savedQuestions.map((q) => ({
      questionText: q.content,
      timeLimitSec: q.timeLimitSec,
      isRandomAnswer: true,
      answers: q.answers.map((a) => ({
        answerText: a.content,
        isCorrect: a.isAnswer,
      })),
    }));

    try {
      await updateQuestion(quizId, payload);
      await Swal.fire({
        title: "🎉 Quiz Updated!",
        text: "Your updated quiz is ready!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "▶️ Play the game!",
        cancelButtonText: "🏠 Back to Home",
        confirmButtonColor: "#8A2BE2",
        cancelButtonColor: "#aaaaaa",
        background: "#fff",
        customClass: {
          popup: "swal2-kahoot-popup",
          title: "swal2-kahoot-title",
          confirmButton: "swal2-kahoot-confirm",
          cancelButton: "swal2-kahoot-cancel",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/create-session");
        } else {
          navigate("/");
        }
      });
    } catch {
      notification.error({ message: "Failed to update quiz" });
    }
  };

  const renderAnswers = () => {
    const layout = {
      2: [["a1", "a2"]],
      3: [["a1", "a2"], ["a3"]],
      4: [
        ["a1", "a2"],
        ["a3", "a4"],
      ],
    };
    const rows = layout[answers.length] || [];
    return (
      <div className={styles.answerGrid}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className={styles.answerRow}>
            {row.map((_, colIdx) => {
              const idx = rowIdx * 2 + colIdx;
              const answer = answers[idx];
              if (!answer) return null;
              return (
                <div
                  key={answer.id}
                  className={`${styles.answerBox} ${
                    [styles.red, styles.blue, styles.yellow, styles.green][idx]
                  }`}
                >
                  <div className={styles.iconBox}>
                    {["▲", "◆", "●", "■"][idx]}
                  </div>
                  <Input
                    value={answer.content}
                    disabled={questionType === "truefalse"}
                    onChange={(e) =>
                      handleChangeAnswer(answer.id, e.target.value)
                    }
                  />
                  <Checkbox
                    checked={answer.isAnswer}
                    onChange={(e) => {
                      if (
                        questionType === "single" ||
                        questionType === "truefalse"
                      ) {
                        setAnswers((prev) =>
                          prev.map((a) =>
                            a.id === answer.id
                              ? { ...a, isAnswer: true }
                              : { ...a, isAnswer: false }
                          )
                        );
                      } else {
                        handleToggleCheckbox(answer.id, e.target.checked);
                      }
                    }}
                  >
                    Correct
                  </Checkbox>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <HeaderQ onSave={handleUpdateQuiz} />
      <div
        className={styles.container}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.sidebarLeft}>
          <h3>{quizTitle}</h3>
          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (!destination) return;
              const items = [...savedQuestions];
              const [moved] = items.splice(source.index, 1);
              items.splice(destination.index, 0, moved);
              setSavedQuestions(items);
            }}
          >
            <Droppable droppableId="questions">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {savedQuestions.map((q, index) => (
                    <Draggable
                      key={q.id}
                      draggableId={q.id.toString()}
                      index={index}
                    >
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={`${styles.questionItem} ${
                            q.id === question.id ? styles.active : ""
                          }`}
                          onClick={() => handleSelectQuestion(q)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            const menu = document.createElement("div");
                            menu.className = styles.contextMenu;
                            menu.style.top = `${e.clientY}px`;
                            menu.style.left = `${e.clientX}px`;
                            menu.innerHTML = `
                              <div class="${styles.menuItem}" id="dup">Duplicate</div>
                              <div class="${styles.menuItem}" id="del">Delete</div>
                            `;
                            document.body.appendChild(menu);

                            const remove = () =>
                              document.body.contains(menu) &&
                              document.body.removeChild(menu);

                            menu.querySelector("#dup").onclick = () => {
                              setSavedQuestions((prev) => [
                                ...prev,
                                { ...q, id: Date.now() },
                              ]);
                              remove();
                            };

                            menu.querySelector("#del").onclick = () => {
                              if (savedQuestions.length === 1) {
                                notification.warning({
                                  message: "Cannot delete last question",
                                });
                              } else {
                                setSavedQuestions((prev) =>
                                  prev.filter((i) => i.id !== q.id)
                                );
                              }
                              remove();
                            };

                            document.addEventListener("click", remove, {
                              once: true,
                            });
                          }}
                        >
                          {`Q${index + 1}: ${q.content.slice(0, 20)}...`}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Upload
            accept=".xlsx"
            beforeUpload={() => false}
            onChange={(info) => {
              const file = info.fileList[0]?.originFileObj;
              if (file) handleChangeImport(file);
            }}
          >
            <Button icon={<UploadOutlined />} block style={{ marginTop: 12 }}>
              Import Questions
            </Button>
          </Upload>

          <Button
            type="primary"
            block
            onClick={handleAddQuestion}
            style={{ marginTop: 12 }}
          >
            + Add Question
          </Button>
          <Button
            type="dashed"
            block
            style={{ marginTop: 12 }}
            onClick={() => setIsAIModalOpen(true)}
          >
            🤖 Create With AI
          </Button>
          <Modal
            title="Create Quiz with AI"
            visible={isAIModalOpen}
            onCancel={() => {
              setIsAIModalOpen(false);
              aiForm.resetFields();
              setAIGeneratedQuestions([]);
              setSelectedAIQuestions([]);
            }}
            onOk={() => aiForm.submit()}
            okText="Generate"
          >
            <Form
              form={aiForm}
              layout="vertical"
              onFinish={async (values) => {
                try {
                  const formData = new FormData();
                  formData.append("Topic", values.Topic);
                  formData.append(
                    "NumberOfQuestions",
                    values.NumberOfQuestions
                  );
                  formData.append("DifficultyLevel", values.DifficultyLevel);
                  formData.append("NumberOfAnswers", 4);

                  const res = await axios.post(
                    "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/generate-ai",
                    formData,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  if (res.status !== 200) throw new Error("Failed to generate");

                  const data = res.data;
                  notification.success({
                    message: "AI Quiz Generated Successfully!",
                  });
                  console.log(data);

                  const transformedQuestions = data.data.map((q, idx) => ({
                    questionText: q.question,
                    timeLimitSec: 10,
                    questionType: "single",
                    answers: q.options.map((opt, j) => ({
                      answerText: opt,
                      isCorrect: opt === q.correctAnswer,
                    })),
                  }));

                  setAIGeneratedQuestions(transformedQuestions);
                  setSelectedAIQuestions([]);
                } catch (err) {
                  notification.error({ message: "AI Generation Failed" });
                }
              }}
            >
              <Form.Item
                name="Topic"
                label="Topic"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Your Topic" />
              </Form.Item>

              <Form.Item
                name="NumberOfQuestions"
                label="Number of Questions"
                rules={[
                  { required: true, message: "Enter number of questions" },
                ]}
              >
                <Input type="number" min={1} max={20} />
              </Form.Item>

              <Form.Item
                name="DifficultyLevel"
                label="Difficulty"
                rules={[{ required: true, message: "Select difficulty level" }]}
              >
                <Select placeholder="Select level">
                  <Option value="veryEasy">Very Easy</Option>
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                  <Option value="veryHard">Very Hard</Option>
                </Select>
              </Form.Item>
            </Form>
            {aiGeneratedQuestions.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Checkbox
                  checked={
                    selectedAIQuestions.length === aiGeneratedQuestions.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAIQuestions(
                        aiGeneratedQuestions.map((q, i) => i)
                      );
                    } else {
                      setSelectedAIQuestions([]);
                    }
                  }}
                >
                  Select All
                </Checkbox>
                <div
                  style={{ maxHeight: 300, overflowY: "auto", marginTop: 12 }}
                >
                  {aiGeneratedQuestions.map((q, index) => (
                    <Card
                      key={index}
                      title={`Question ${index + 1}`}
                      style={{
                        marginBottom: 8,
                        border:
                          selectedAIQuestions.includes(index) &&
                          "2px solid #1890ff",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedAIQuestions((prev) =>
                          prev.includes(index)
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
                        );
                      }}
                    >
                      <p>{q.questionText}</p>
                      <ul>
                        {q.answers.map((a, i) => (
                          <li key={i}>
                            {a.answerText} {a.isCorrect ? "✅" : ""}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <Button
                    type="primary"
                    disabled={selectedAIQuestions.length === 0}
                    onClick={() => {
                      const selected = selectedAIQuestions.map(
                        (i) => aiGeneratedQuestions[i]
                      );
                      const parsed = selected.map((q, idx) => ({
                        id: Date.now() + idx,
                        content: q.questionText,
                        file: null,
                        timeLimitSec: q.timeLimitSec || 10,
                        questionType: q.questionType || "single",
                        answers: q.answers.map((a, j) => ({
                          id: Date.now() + idx * 10 + j,
                          content: a.answerText,
                          isAnswer: a.isCorrect,
                        })),
                      }));
                      setSavedQuestions((prev) => [...prev, ...parsed]);
                      setIsAIModalOpen(false);
                      aiForm.resetFields();
                      setAIGeneratedQuestions([]);
                      notification.success({ message: "Questions Added" });
                    }}
                  >
                    Add Selected Questions
                  </Button>
                  <Button onClick={() => aiForm.submit()}>
                    Generate Again
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>

        <div className={styles.editor}>
          <div className={styles.editorTop}>
            <Input.TextArea
              value={question.content}
              onChange={(e) =>
                setQuestion((prev) => ({ ...prev, content: e.target.value }))
              }
              minLength={questionLengthConfig.min}
              maxLength={questionLengthConfig.max}
              placeholder="Enter your question"
              autoSize={{ minRows: 2 }}
              className={styles.questionInput}
            />
            <Button
  type="dashed"
  size="small"
  className={styles.aiButton}
  onClick={handleGenerateAIAnswers}
  disabled={!question.content?.trim() || questionType === "truefalse"}
>
  Answer with AI
</Button>

          </div>

          {renderAnswers()}
        </div>

        <div className={styles.sidebarRight}>
          <h4>Question Type</h4>
          <Select
            value={questionType}
            onChange={(val) => {
              setQuestionType(val);
              setQuestion((prev) => ({ ...prev, questionType: val }));

              if (val === "truefalse") {
                setAnswers([
                  { id: Date.now(), content: "True", isAnswer: false },
                  { id: Date.now() + 1, content: "False", isAnswer: false },
                ]);
              } else if (val === "single") {
                setAnswers([
                  { id: Date.now(), content: "", isAnswer: false },
                  { id: Date.now() + 1, content: "", isAnswer: false },
                  { id: Date.now() + 2, content: "", isAnswer: false },
                  { id: Date.now() + 3, content: "", isAnswer: false },
                ]);
              }
            }}
            style={{ width: "100%" }}
          >
            <Option value="truefalse">True / False</Option>
            <Option value="single">Multiple Choice (Single Correct)</Option>
            <Option value="multiple" disabled>
              Multiple Choice (Multiple Correct) - Coming Soon
            </Option>
          </Select>

          <h4 style={{ marginTop: 20 }}>Time Limit (seconds)</h4>
          <Select
            value={question.timeLimitSec}
            min={timeLimitConfig.min}
            max={timeLimitConfig.max}
            onChange={(val) =>
              setQuestion((prev) => ({ ...prev, timeLimitSec: val }))
            }
            style={{ width: "100%" }}
          >
            {Array.from(
              {
                length:
                  Math.floor((timeLimitConfig.max - timeLimitConfig.min) / 10) +
                  1,
              },
              (_, i) => timeLimitConfig.min + i * 10
            ).map((sec) => (
              <Option key={sec} value={sec}>
                {sec} giây
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default UpdateQuestionScreen;
