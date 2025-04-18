import React, { state, useState, useEffect } from "react";
import { Input, Upload, Checkbox, Button, Popover } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { info } from "autoprefixer";

const CreateQuestion = () => {
    const [answers, setAnswers] = useState([{ id: '0', content: "", isAnswer: false }]);
    const [question, setQuestion] = useState({
        id: Date.now(),
        content: "",
        file: null,
        answers: [],
    });

    const [savedQuestions, setSavedQuestions] = useState([]);
    const handleAddAnswer = () => {
        console.log("LOG:", answers);
        const newAnswer = {
            id: Date.now(),
            content: '',
            isAnswer: false
        }
        setAnswers([...answers, newAnswer]);

    }
    const handleToggleCheckbox = (id, isChecked) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === id ? { ...answer, isAnswer: isChecked } : answer
        );
        setAnswers(updatedAnswers);
    };

    const textInput = {

        fontSize: "18px",
        width: "600px",

        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: "black",
    };
    const textBoxStyle = {
        width: "100%",
        height: "50%",
    }
    const answersStyle = {
        display: "flex",
        textAlign: "left",
        fontSize: "18px",

        margin: "10px",

        borderRadius: "10px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: "black",
        height: "53px",
        width: "calc(45% - 20px)"
    }
    const headerStyle = {
        textAlign: "left", color: "black", width: "600px", margin: "0px",


    }

    const handleDuplicateAnswer = (id) => {
        const answerToDuplicate = answers.find((answer) => answer.id === id);
        if (!answerToDuplicate) {
            console.error("Invalid answer id:", id);
            return;
        }
        const newAnswer = { ...answerToDuplicate, id: Date.now() }; // Tạo id mới bằng Date.now
        setAnswers([...answers, newAnswer]);
    };
    const handleSaveQuestion = () => {

        console.log("Question:", question);
        setSavedQuestions([...savedQuestions, answers]);
    }
    const handleDeleteAnswer = (id) => {
        const newAnswers = answers.filter((answer) => answer.id !== id);
        setAnswers(newAnswers);
    };

    const handleChangeAnswer = (id, value) => {


        const updatedAnswers = answers.map(answer =>
            answer.id === id ? { ...answer, content: value } : answer
        );

        setAnswers(updatedAnswers);

        console.log("LOG:", updatedAnswers.find(a => a.id === id));
    };
    const handleChangeFile = (file) => {
        setQuestion({ ...question, file: file });
        console.log("LOG:", question.file);

    }
    const handleChangeQuestion = (id, value) => {
        setQuestion({ ...question, content: value });
        console.log("LOG:", question);
    }

    const buttonStyle = {

        width: "auto",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    };
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{
                    width: "300px",
                    backgroundColor: "#f7f7f7",
                    padding: "20px",
                    borderRadius: "20px",
                    margin: "20px"
                }}>
                    <h2 style={{ color: "black" }}>Saved Questions</h2>
                    {/* Danh sách câu hỏi sẽ hiện ở đây */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {/* Mỗi câu hỏi sẽ là 1 ô div */}
                        <div style={{
                            backgroundColor: "#ffffff",
                            padding: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            cursor: "pointer"
                        }}>
                            Question 1
                        </div>


                    </div>
                </div>
                < div style={{ margin: "100px", padding: "50px", borderRadius: "30px", backgroundColor: "#f0f2f5" }}>

                    <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                        <h1 style={{ color: "black", marginBottom: "50px" }}>Create Question</h1>
                        <h3 style={headerStyle}>Question </h3>

                        <input type="text" onChange={(e) => handleChangeQuestion(question.id, e.target.value)} placeholder="Question" required style={{ ...textInput, height: "200px", borderRadius: "20px" }} />
                        <h3 style={headerStyle}>Upload File </h3>
                        <Upload
                            accept=".pdf, .doc, .png, .jpg, .jpeg"
                            onChange={(info) => handleChangeFile(info.file)}
                            maxCount={1}
                            beforeUpload={() => false}  //
                            style={{ width: "100%" }}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{
                                    ...textInput,
                                    height: "70px",

                                    alignItems: "center",
                                    justifyContent: "top",

                                }}
                            >
                                Click to Upload
                            </Button>
                        </Upload>
                        <h3 style={headerStyle}>Answer </h3>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "600px" }}>
                            {answers.map((answer) => (
                                <Popover
                                    key={answer.id}
                                    trigger="hover"
                                    placement="topRight"
                                    content={
                                        <div style={{ display: "flex", flexDirection: "column", width: "auto", gap: "5px" }}>
                                            <Button
                                                size="small"
                                                onClick={() => handleDeleteAnswer(answer.id)}
                                                style={{ ...buttonStyle, backgroundColor: "#f44336" }}>
                                                Delete
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => handleDuplicateAnswer(answer.id)}
                                                style={{ ...buttonStyle, backgroundColor: "blue" }}>
                                                Duplicate
                                            </Button>
                                        </div>
                                    }
                                >
                                    <div style={{ ...answersStyle }}>
                                        <input
                                            type="text"
                                            placeholder={`Answer`}
                                            required
                                            value={answer.content}
                                            style={{
                                                width: "70%",
                                                height: "18%",
                                                margin: "9px",
                                                borderRadius: "8px",
                                                border: "1px solid #ccc",
                                                color: "black",
                                                backgroundColor: "#f9f9f9",
                                                fontSize: "16px",
                                            }}
                                            onChange={(e) => handleChangeAnswer(answer.id, e.target.value)}
                                        />
                                        <Checkbox
                                            checked={answer.isAnswer}
                                            onChange={(e) => handleToggleCheckbox(answer.id, e.target.checked)}
                                            style={{ margin: '10px', fontSize: '10px' }}
                                        />
                                    </div>
                                </Popover>
                            ))}


                        </div>
                        <button type="button" onClick={handleAddAnswer}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                cursor: "pointer"
                            }}>Add Answer</button>
                        <button
                            type="button"
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                backgroundColor: "#1890ff", // màu xanh khác với nút Add Answer
                                color: "white",
                                border: "none",
                                cursor: "pointer"
                            }}
                            onClick={
                                handleSaveQuestion
                            }
                        >
                            Save Question
                        </button>
                    </form >        </div >
            </div>
        </div >

    );

}

export default CreateQuestion;
