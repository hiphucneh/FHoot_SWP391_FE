import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Upload, Checkbox, Button, Select, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { createQuestion } from "../services/createQuestion";
import HeaderQ from "./HeaderQ";
import styles from "./CreateQuestion.module.css";
import bgImage from "../assets/bg-Q.jpg";

const { Option } = Select;

const CreateQuestionScreen = () => {
    const quizId = localStorage.getItem("quizId");
    const navigate = useNavigate();

    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [savedQuestions, setSavedQuestions] = useState(() => {
        const saved = localStorage.getItem(`savedQuestions_${quizId}`);
        const parsed = saved ? JSON.parse(saved) : [];
        if (parsed.length === 0) {
            const newQ = {
                id: Date.now(),
                content: "",
                file: null,
                answers: [],
                timeLimitSec: 30,
            };
            localStorage.setItem(`savedQuestions_${quizId}`, JSON.stringify([newQ]));
            return [newQ];
        }
        return parsed;
    });

    useEffect(() => {
        if (savedQuestions.length > 0 && !question.id) {
            handleSelectQuestion(savedQuestions[0]);
        }
    }, [savedQuestions]);

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

    useEffect(() => {
        localStorage.setItem(`savedQuestions_${quizId}`, JSON.stringify(savedQuestions));
    }, [savedQuestions, quizId]);

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

    const handleSelectQuestion = (q) => {
        setQuestion(q);
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

    const handleImageUpload = (file) => {
        setQuestion((prev) => ({ ...prev, file }));
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

    const handleSaveQuiz = async () => {
        if (!quizId || savedQuestions.length === 0) {
            return notification.warning({ message: "No questions to save" });
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
            await createQuestion(payload);
            await Swal.fire({
                title: "🎉 Quiz Saved!",
                text: "Your quiz is ready to go!",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "▶️ Play the game!",
                cancelButtonText: "🏠 Back to Home",
                confirmButtonColor: "#8A2BE2",   // Kahoot-style purple
                cancelButtonColor: "#aaaaaa",
                background: "#fff",
                customClass: {
                    popup: "swal2-kahoot-popup",
                    title: "swal2-kahoot-title",
                    confirmButton: "swal2-kahoot-confirm",
                    cancelButton: "swal2-kahoot-cancel",
                },
            }).then((result) => {
                localStorage.removeItem(`savedQuestions_${quizId}`);
                if (result.isConfirmed) {
                    navigate("/create-session");
                } else {
                    navigate("/");
                }
            });

        } catch {
            notification.error({ message: "Failed to save quiz" });
        }
    };

    const renderAnswers = () => {
        const layout = {
            2: [["a1", "a2"]],
            3: [["a1", "a2"], ["a3"]],
            4: [["a1", "a2"], ["a3", "a4"]],
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
                                    className={`${styles.answerBox} ${[styles.red, styles.blue, styles.yellow, styles.green][idx]
                                        }`}
                                >
                                    <div className={styles.iconBox}>
                                        {["▲", "◆", "●", "■"][idx]}
                                    </div>
                                    <Input
                                        value={answer.content}
                                        placeholder={`Answer ${idx + 1}`}
                                        onChange={(e) =>
                                            handleChangeAnswer(answer.id, e.target.value)
                                        }
                                    />
                                    <Checkbox
                                        checked={answer.isAnswer}
                                        onChange={(e) =>
                                            handleToggleCheckbox(answer.id, e.target.checked)
                                        }
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
            <HeaderQ onSave={handleSaveQuiz} />
            <div
                className={styles.container}
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Sidebar Left */}
                <div className={styles.sidebarLeft}>
                    <h3>Questions</h3>
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
                                                    className={`${styles.questionItem} ${q.id === question.id ? styles.active : ""
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

                    <Button type="primary" block onClick={handleAddQuestion} style={{ marginTop: 12 }}>
                        + Add Question
                    </Button>
                </div>

                {/* Editor */}
                <div className={styles.editor}>
                    <Input.TextArea
                        value={question.content}
                        onChange={(e) =>
                            setQuestion((prev) => ({ ...prev, content: e.target.value }))
                        }
                        placeholder="Enter your question"
                        autoSize={{ minRows: 2 }}
                    />
                    <div className={styles.editorImage}>
                        <Upload
                            accept=".png,.jpg,.jpeg"
                            beforeUpload={() => false}
                            maxCount={1}
                            onChange={(info) => {
                                const file = info.fileList[0]?.originFileObj;
                                if (file) handleImageUpload(file);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </div>
                    {renderAnswers()}
                </div>

                {/* Sidebar Right */}
                <div className={styles.sidebarRight}>
                    <h4>Number of Answers</h4>
                    <Select
                        value={answers.length}
                        onChange={handleChangeAnswerCount}
                        style={{ width: "100%" }}
                    >
                        {[2, 3, 4].map((n) => (
                            <Option key={n} value={n}>
                                {n}
                            </Option>
                        ))}
                    </Select>

                    <h4 style={{ marginTop: 20 }}>Time Limit (seconds)</h4>
                    <Select
                        value={question.timeLimitSec}
                        onChange={(val) =>
                            setQuestion((prev) => ({ ...prev, timeLimitSec: val }))
                        }
                        style={{ width: "100%" }}
                    >
                        {[5, 10, 15, 20, 30, 40].map((sec) => (
                            <Option key={sec} value={sec}>
                                {sec}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        </>
    );
};

export default CreateQuestionScreen;