import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { updateKahoot } from "../services/updateKahoot";
import styles from "./CreateKahoot.module.css";

const UpdateKahootScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [kahoot, setKahoot] = useState({
    title: "",
    description: "",
    imgUrl: null,
    quizId: null,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const incoming = location.state?.quiz;
    if (incoming) {
      setKahoot({
        title: incoming.title || "",
        description: incoming.description || "",
        imgUrl: incoming.imgUrl || null,
        quizId: incoming.quizId,
      });
      if (incoming.imgUrl) setPreview(incoming.imgUrl);
    }
  }, [location.state]);

  const handleChangeFile = (info) => {
    const selectedFile = info.file;
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", kahoot.title);
    formData.append("Description", kahoot.description);
    if (file && typeof file !== "string") formData.append("ImgUrl", file);

    try {
      await updateKahoot(kahoot.quizId, formData);
      localStorage.setItem("quizId", kahoot.quizId.toString());

      Swal.fire({
        title: "✅ Kahoot Updated!",
        text: "Your kahoot was updated successfully.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to Edit Questions",
        cancelButtonText: "Back",
        confirmButtonColor: "#6f42c1",
        cancelButtonColor: "#d9d9d9",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/updateq", {
            state: {
              quizId: kahoot.quizId,
              quizTitle: kahoot.title,
              questions: location.state.quiz.questions,
            },
          });
        } else {
          navigate(-1);
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update Kahoot", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.formCard} ${styles.fadeIn}`}>
        <div className={`${styles.header} ${styles.fadeIn}`}>
          <h2>Update Kahoot</h2>
        </div>

        <Upload
          accept=".png,.jpg,.jpeg"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={(info) => handleChangeFile(info)}
        >
          <div className={`${styles.avatarBox} ${styles.fadeIn}`}>
            {preview ? (
              <img src={preview} alt="Preview" className={styles.avatarImg} />
            ) : (
              <>
                <UploadOutlined className={styles.uploadIcon} />
                <span className={styles.avatarText}>Upload Cover Image</span>
              </>
            )}
          </div>
        </Upload>

        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.fadeIn}`}>
          <input
            type="text"
            placeholder="Kahoot Title"
            value={kahoot.title}
            onChange={(e) => setKahoot((prev) => ({ ...prev, title: e.target.value }))}
            className={styles.input}
            required
          />

          <textarea
            placeholder="Description"
            value={kahoot.description}
            onChange={(e) => setKahoot((prev) => ({ ...prev, description: e.target.value }))}
            className={styles.textarea}
            required
          ></textarea>

          <button type="submit" className={styles.submitButton}>
            Update Kahoot
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateKahootScreen;
