import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./LoadCode.module.css";

const LoadCode = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowModal(true);
    }, 1000); // Show modal after 1s

    const timer2 = setTimeout(() => {
      navigate("/group-list");
    }, 4000); // Total 4s: 1s loading + 3s modal

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <Spin size="large" className={styles.spinner} />
      <Modal
        open={showModal}
        footer={null}
        closable={false}
        centered
        className={styles.modal}
      >
        <p className={styles.modalText}>Generating your game PIN...</p>
      </Modal>
    </div>
  );
};

export default LoadCode;
