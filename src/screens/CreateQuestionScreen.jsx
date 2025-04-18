import React, { state, useState } from "react";
import { Input, Checkbox, Button } from "antd";

const CreateQuestion = () => {
    const [answers, setAnswers] = useState([{ content: "", isAnswer: false }]);
    const handleAddAnswer = () => {
        console.log("Add Answer clicked");


    }
    const textInput = {
        textAlign: "left",
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
        height: "50px",
        width: "calc(45% - 20px)"
    }
    const headerStyle = {
        textAlign: "left", color: "black", width: "600px", margin: "10px",


    }
    return (

        < div style={{ margin: "100px", padding: "50px", borderRadius: "30px", backgroundColor: "#f0f2f5" }}>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                <h1 style={{ color: "black", marginBottom: "50px" }}>Create Question</h1>
                <h3 style={headerStyle}>Question </h3>
                <input type="text" placeholder="Question" required style={{ ...textInput, height: "200px", borderRadius: "20px" }} />
                <h3 style={headerStyle}>Upload File </h3>
                <input
                    type="file"
                    style={{ ...textInput, height: "70px" }}
                />
                <h3 style={headerStyle}>Answer </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "600px" }}>
                    <div style={{ ...answersStyle }}>

                        <input
                            type="text"
                            placeholder={`Answer`}
                            required
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
                        />
                        <Checkbox style={{ marginLeft: "10px" }}></Checkbox>


                    </div>


                </div>
                <button type="button" onClick={handleAddAnswer} style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>Add Answer</button>
            </form >        </div >

    );
    ;
}

export default CreateQuestion;
