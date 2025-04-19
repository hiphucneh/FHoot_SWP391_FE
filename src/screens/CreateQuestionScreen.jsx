import React, { state, useState, useEffect } from "react";
import { Input, notification, Upload, Checkbox, Button, Popover } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import '../components/CreateQuestion.css';

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



    const headerStyle = {
        textAlign: "left", color: "black", width: "600px", margin: "30px",


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
        const updatedQuestion = {
            ...question,
            answers: answers,
        };

        const isExist = savedQuestions.some(q => q.id === updatedQuestion.id);
        if (updatedQuestion.content === "") {
            notification.error({
                message: 'Lỗi lưu câu hỏi',
                description: 'Vui lòng nhập nội dung câu hỏi.',
                placement: 'topRight'
            });

        } else if (updatedQuestion.answers.length < 2) {
            notification.error({
                message: 'Lỗi lưu câu hỏi',
                description: 'Vui lòng nhập ít nhất 2 câu trả lời.',
                placement: 'topRight'
            });
        } else if (updatedQuestion.answers.some(answer => answer.isAnswer === true) === false) {
            notification.error({
                message: 'Lỗi lưu câu hỏi',
                description: 'Vui lòng nhập 1 đáp án.',
                placement: 'topRight'
            });
        }
        if (isExist) {

            setSavedQuestions(savedQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
        } else {

            setSavedQuestions([...savedQuestions, updatedQuestion]);
        }

        console.log("LOG:", updatedQuestion);
    };
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
    const handleSelectQuestion = (q) => {
        setQuestion({
            id: q.id,
            content: q.content,
            file: q.file,
            answers: q.answers,
        });
        setAnswers(q.answers);
    };
    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            content: "",
            file: null,
            answers: [],
        };

        setSavedQuestions([...savedQuestions, newQuestion]);
        console.log("LOG:", newQuestion);
        console.log("LOG:", savedQuestions);
    }
    const handleDeleteQuestion = (id) => {
        const newSavedQuestions = savedQuestions.filter((question) => question.id !== id);
        setSavedQuestions(newSavedQuestions);
        console.log("LOG:", newSavedQuestions);
    }

    return (
        <div >
            <div style={{ display: "flex" }}>
                <div style={{
                    width: "300px",
                    backgroundColor: "#f7f7f7",
                    padding: "20px",
                    borderRadius: "20px",
                    marginTop: "100px"
                }}>
                    <h2 style={{ color: "black" }}>Saved Questions</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {savedQuestions.map((q, index) => (
                            <div key={q.id}
                                onClick={() => handleSelectQuestion(q)}
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    color: "black",
                                    transition: "all 0.3s ease",
                                }} onMouseEnter={(e) => {
                                    //-----------------CSS/AI----------------//
                                    e.target.style.backgroundColor = "#e6f7ff";
                                    e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
                                }}
                                onMouseLeave={(e) => {

                                    e.target.style.backgroundColor = "#ffffff";
                                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                                }}
                            >
                                {`Question ${index + 1}: ${q.content}`}<br />
                                <Button
                                    size="small"
                                    style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
                                    onClick={() => handleDeleteQuestion(q.id)}
                                >Delete</Button>
                            </div>
                        ))}
                        <button onClick={handleAddQuestion}>+ More Question</button>
                    </div>
                </div>
                < div style={{ margin: "100px", padding: "50px", borderRadius: "30px", backgroundColor: "#f0f2f5" }}>

                    <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                        <h1 style={{ color: "black", marginBottom: "50px" }}>Create Question</h1>
                        <h3 style={headerStyle}>Question </h3>

                        <input
                            type="text" onChange={(e) => handleChangeQuestion(question.id, e.target.value)}
                            placeholder="Question"
                            required
                            className="text-input"
                            value={question.content}
                        />
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
                                className="text-input"

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
                                                className="delete-button"
                                                style={{ backgroundColor: "red", color: "white" }}>
                                                Delete
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => handleDuplicateAnswer(answer.id)}
                                                className="delete-button"
                                                style={{ backgroundColor: "Blue", color: "white" }}>
                                                Duplicate
                                            </Button>
                                        </div>
                                    }
                                >
                                    <div className="answer-container">
                                        <input
                                            type="text"
                                            placeholder={`  Answer`}
                                            required
                                            value={answer.content}
                                            className="input-basic"
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
                                backgroundColor: "#1890ff",
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
            </div >
        </div >

    );

}

export default CreateQuestion;
