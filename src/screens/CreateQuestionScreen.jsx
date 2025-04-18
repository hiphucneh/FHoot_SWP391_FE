import React, { state, useState } from "react";
import { Input, Upload, Checkbox, Button, Popover } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const CreateQuestion = () => {
    const [answers, setAnswers] = useState([{ id: '0', content: "", isAnswer: false }]);
    const handleAddAnswer = () => {
        const newAnswer = {
            id: Date.now(),  // Dùng timestamp làm id unique
            content: "",
            isAnswer: false
        };
        setAnswers([...answers, newAnswer]);
    }

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
        width: "100%",  // full width của div cha
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

    const buttonStyle = {

        width: "auto",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    };
    return (

        < div style={{ margin: "100px", padding: "50px", borderRadius: "30px", backgroundColor: "#f0f2f5" }}>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                <h1 style={{ color: "black", marginBottom: "50px" }}>Create Question</h1>
                <h3 style={headerStyle}>Question </h3>

                <input type="text" placeholder="Question" required style={{ ...textInput, height: "200px", borderRadius: "20px" }} />
                <h3 style={headerStyle}>Upload File </h3>
                <Upload
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
            </form >        </div >

    );

}

export default CreateQuestion;
