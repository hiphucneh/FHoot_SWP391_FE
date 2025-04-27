import { Button, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { updateKahoot } from '../services/updateKahoot';

import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import '../components/CreateQuestion.css';
import React from 'react';

const UpdateKahoot = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [kahoot, setKahoot] = useState(() => {
        return location.state?.quiz || {
            title: "",
            description: "",
            imgUrl: null,

        };
    });
    const [file, setFile] = useState(null);

    // Load dữ liệu kahoot ban đầu
    useEffect(() => {
        if (location.state?.quiz) {
            console.log("Quiz nhận được từ location:", location.state.quiz);
            setKahoot({
                title: location.state.quiz.title || "",
                description: location.state.quiz.description || "",
                imgUrl: location.state.quiz.imgUrl || null,
                quizId: location.state.quiz.quizId,
            });
            setFile(location.state.quiz.imgUrl || null);
        } else {
            console.log("Không có quiz trong location.state!");
        }
    }, [location.state]);

    const handleOnChangeTitle = (e) => {
        const newTitle = e.target.value;
        console.log("Title changed: ", newTitle); // Console log khi title thay đổi
        setKahoot(prev => ({ ...prev, title: newTitle }));
    };

    const handleOnChangeDes = (e) => {
        const newDescription = e.target.value;
        console.log("Description changed: ", newDescription); // Console log khi description thay đổi
        setKahoot(prev => ({ ...prev, description: newDescription }));
    };

    const handleChangeFile = (info) => {
        if (info.file.originFileObj) {
            console.log("File selected: ", info.file.originFileObj); // Console log khi file thay đổi
            setFile(info.file.originFileObj);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Title", kahoot.title);
        formData.append("Description", kahoot.description);

        if (file && typeof file !== 'string') {
            formData.append("ImgUrl", file);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const data = await updateKahoot(kahoot.quizId, formData);
            const quizId = kahoot.quizId;

            if (quizId) {
                console.log("Quiz ID received:", quizId);
                localStorage.setItem("quizId", quizId.toString());
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Kahoot đã được cập nhật. Bạn sẽ được chuyển đến trang thêm câu hỏi.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7266ef',
                });
                console.log("Quiz title trước khi điều hướng:", kahoot.title);
                navigate('/updateq', {
                    state: {
                        quizId: location.state.quiz.quizId, // Access quizId directly from location.state.quiz
                        quizTitle: kahoot.title,
                        questions: location.state.quiz.questions
                    }
                });

            } else {
                await Swal.fire({
                    title: 'Lỗi!',
                    text: 'Không lấy được ID từ server!',
                    icon: 'error',
                    confirmButtonColor: '#ff4d4f',
                });
            }
        } catch (error) {
            console.log(error);
            await Swal.fire({
                title: 'Lỗi!',
                text: 'Cập nhật Kahoot thất bại!',
                icon: 'error',
                confirmButtonColor: '#ff4d4f',
            });
        }
    };

    return (
        <div className="create-kahoot-screen" style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 1 }}>
            <div
                className="create-kahoot-screen"
                style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: 'center',
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "40px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <h1>Update Kahoot</h1>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
                    <input
                        name="KahootTitle"
                        style={{ backgroundColor: "#f0f0f0", color: "black", textAlign: 'left', padding: '10px', borderRadius: "15px", border: "2px solid #ccc", margin: "10px", width: "300px", height: "50px" }}
                        type="text"
                        value={kahoot.title}  // Thay Title thành title
                        onChange={handleOnChangeTitle}
                        placeholder="Kahoot Title"
                        required
                    />
                    <Upload
                        accept=".png, .jpg, .jpeg"
                        beforeUpload={() => false}
                        onChange={handleChangeFile}
                        maxCount={1}
                        style={{ width: "200px" }}
                    >
                        <Button
                            style={{ width: "300px", height: "50px", backgroundColor: "#7d3c98", color: "white", borderRadius: "5px", margin: "10px" }}
                            icon={<UploadOutlined />}
                            className="text-input"
                        >
                            Click to Upload Kahoot Image
                        </Button>
                    </Upload>
                    <textarea
                        placeholder="Description"
                        required
                        value={kahoot.description}  // Thay Description thành description
                        name="KahootDescription"
                        style={{ width: "300px", height: "100px", color: "black", textAlign: 'left', padding: '10px', backgroundColor: "#f0f0f0", borderRadius: "15px", margin: "10px" }}
                        onChange={handleOnChangeDes}
                    ></textarea>
                    <button
                        type="submit"
                        style={{ width: "200px", height: "50px", backgroundColor: "#7d3c98", border: "none", borderRadius: "10px", marginTop: "10px", fontSize: "16px" }}
                    >
                        Update Kahoot
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateKahoot;
