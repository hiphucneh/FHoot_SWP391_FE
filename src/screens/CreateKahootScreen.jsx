import React, { useState } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createKahoot } from "../services/createKahoot";
import styles from "./CreateKahoot.module.css";

const CreateKahoot = () => {
  const navigate = useNavigate();
  const [kahoot, setKahoot] = useState({ Title: "", Description: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChangeFile = (info) => {
    const selectedFile = info.file;
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", kahoot.Title);
    formData.append("Description", kahoot.Description);
    if (file) formData.append("ImgUrl", file);

    try {
      const res = await createKahoot(formData);
      const quizId = res.data?.quizId;
      if (quizId) {
        localStorage.setItem("quizId", quizId.toString());
        Swal.fire({
          title: "🎉 Kahoot Created!",
          html: `<p>Your Kahoot is ready to be edited or played!</p>`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Go to Edit",
          cancelButtonText: "Back",
          confirmButtonColor: "#6f42c1",
          cancelButtonColor: "#d9d9d9",
        }).then((result) => {
          if (result.isConfirmed) navigate("/createq");
          else navigate(-1);
        });
      } else {
        Swal.fire("Error", "No quiz ID returned from server.", "error");
      }
    } catch {
      Swal.fire("Error", "Failed to create Kahoot", "error");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.formCard} ${styles.fadeIn}`}>
          <div className={`${styles.header} ${styles.fadeIn}`}>
            <h2>Create a Kahoot</h2>
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
                  <span className={styles.avatarText}>
                    Upload Cover Image (Optional)
                  </span>
                </>
              )}
            </div>
          </Upload>

          <form onSubmit={handleSubmit} className={`${styles.form} ${styles.fadeIn}`}>
            <input
              type="text"
              placeholder="Kahoot Title"
              value={kahoot.Title}
              onChange={(e) =>
                setKahoot({ ...kahoot, Title: e.target.value })
              }
              className={styles.input}
              required
            />

            <textarea
              placeholder="Description"
              value={kahoot.Description}
              onChange={(e) =>
                setKahoot({ ...kahoot, Description: e.target.value })
              }
              className={styles.textarea}
              required
            ></textarea>

            <button type="submit" className={styles.submitButton}>
              Create Kahoot
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateKahoot;
