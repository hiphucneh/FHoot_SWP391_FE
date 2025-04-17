import React, { useState } from "react";
import { Input, Checkbox, Button } from "antd";

const CreateQuestion = () => {
    const textInput = {
        textAlign: "left",
        fontSize: "18px",
        width: "600px",
        margin: "10px",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: "black",
    };
    const answers = {
        ...textInput,
        height: "50px",
        width: "calc(45% - 20px)"
    }
    const header = {
        textAlign: "left", color: "black", width: "600px", margin: "10px",


    }
    return (

        < div style={{ margin: "100px", padding: "50px", borderRadius: "30px", backgroundColor: "#f0f2f5" }}>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                <h1 style={{ color: "black", marginBottom: "50px" }}>Create Question</h1>
                <h3 style={header}>Question </h3>
                <input type="text" placeholder="Question" required style={{ ...textInput, height: "200px", borderRadius: "20px" }} />
                <h3 style={header}>Upload File </h3>
                <input
                    type="file"
                    style={{ ...textInput, height: "70px" }}
                />
                <h3 style={header}>Answer </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "600px" }}>
                    <input type="text" placeholder="Answer" required style={{ ...answers }} />
                    <input type="text" placeholder="Answer" required style={{ ...answers }} />
                    <input type="text" placeholder="Answer" required style={{ ...answers }} />
                    <input type="text" placeholder="Answer" required style={{ ...answers }} />
                </div >
            </form>        </div >

    );
    ;
}

export default CreateQuestion;
