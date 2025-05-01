import { useNavigate } from "react-router-dom";

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❌ Payment Cancelled</h1>
      <p style={styles.text}>You cancelled the payment. No charges were made.</p>
      <button style={styles.button} onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "4rem",
  },
  title: {
    color: "#f44336",
    fontSize: "2rem",
  },
  text: {
    margin: "1rem 0",
    fontSize: "1.2rem",
  },
  button: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#7e57c2",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default PaymentCancel;
