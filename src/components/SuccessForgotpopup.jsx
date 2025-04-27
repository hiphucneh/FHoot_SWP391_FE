import './styles.css';

function SuccessForgotpopup({ onClose }) {

  const handleBackHome = () => {
    onClose();
    setTimeout(() => {
      window.location.href = "/Home";
    }, 300); // Delay 300ms cho đóng popup mượt hơn
  };

  return (
    <div className="login show-login">
      <div className="login__form">
        <h2 className="login__title">Success!</h2>
        <p className="login__description">Your password has been reset successfully 🎉</p>

        <button className="login__button" onClick={handleBackHome}>
          🏠 Back to Home
        </button>
      </div>

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default SuccessForgotpopup;
