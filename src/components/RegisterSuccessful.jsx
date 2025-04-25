import './styles.css';
import 'remixicon/fonts/remixicon.css';

function RegisterSuccessful({ show, onClose, onGoToLogin }) {
  if (!show) return null;

  return (
    <div className="login show-login" id="register-successful">
      <div className="login__form">
        <h2 className="login__title">🎉 Account Created!</h2>
        <p className="login__description">
          Your account has been successfully created and verified.
        </p>

        <button className="login__button" onClick={onGoToLogin}>
          Go to Login
        </button>
      </div>

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default RegisterSuccessful;
