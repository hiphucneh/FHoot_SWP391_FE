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
    const header = {
        textAlign: "left", color: "black", width: "600px"

    }
    return (

        < div style={{ padding: "100px" }}>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px" }}>
                <h1>Create Question</h1>
                <h3 style={{ ...header }}>Question </h3>
                <input type="text" placeholder="Question" required style={{ ...textInput, height: "200px", borderRadius: "20px" }} />
                <h3 style={{ ...header }}>Upload File </h3>
                <input
                    type="file"
                    style={{ ...textInput, height: "70px" }}
                />
            </form>        </div >

    );
    ;
}
export default CreateQuestion;
