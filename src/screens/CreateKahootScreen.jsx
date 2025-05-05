import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createKahoot } from "../services/createKahoot";
import styles from "./CreateKahoot.module.css";

const CreateKahoot = () => {
  const navigate = useNavigate();
  const [kahoot, setKahoot] = useState({ Title: "", Description: "" });




  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", kahoot.Title);
    formData.append("Description", kahoot.Description);


    console.log("📤 Submitting FormData:");
    for (let pair of formData.entries()) {
      console.log("→", pair[0], ":", pair[1]);
    }

    try {
      const res = await createKahoot(formData);
      console.log("✅ Response from createKahoot:", res);

      const quizId = res.data?.quizId;
      if (quizId) {
        console.log("🎯 Quiz ID:", quizId);
        localStorage.setItem("quizId", quizId.toString());
        Swal.fire({
          title: "🎉 Fhoot Created!",
          html: `<p>Your Fhoot is ready to be edited or played!</p>`,
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
        console.error("❌ No quiz ID returned.");
        Swal.fire("Error", "No quiz ID returned from server.", "error");
      }
    } catch (err) {
      console.error("❌ Error creating Fhoot:", err);
      Swal.fire("Error", "Failed to create Fhoot", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.formCard} ${styles.fadeIn}`}>
        <div className={`${styles.header} ${styles.fadeIn}`}>
          <h2>Create a Fhoot</h2>
        </div>


        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.fadeIn}`}>
          <input
            type="text"
            placeholder="Fhoot Title"
            value={kahoot.Title}
            onChange={(e) => {
              setKahoot({ ...kahoot, Title: e.target.value });
              console.log("📝 Title changed:", e.target.value);
            }}
            className={styles.input}
            required
          />

          <textarea
            placeholder="Description"
            value={kahoot.Description}
            onChange={(e) => {
              setKahoot({ ...kahoot, Description: e.target.value });
              console.log("📝 Description changed:", e.target.value);
            }}
            className={styles.textarea}
            required
          ></textarea>

          <button type="submit" className={styles.submitButton}>
            Create Fhoot
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateKahoot;
