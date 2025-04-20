import './styles.css';
import 'remixicon/fonts/remixicon.css';

function ForgotPass({ show, onClose, onSwitchToLogin }) {
  return (
    <div className={`login ${show ? "show-login" : ""}`} id="forgot-password">
      <form className="login__form">
        <h2 className="login__title">Forgot Password</h2>

        <div className="login__group">
          <div>
            <label htmlFor="forgot-email" className="login__label">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email to reset password"
              id="forgot-email"
              className="login__input"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="login__button">
            Send Reset Link
          </button>
          <p className="login__signup">
            Remember your password?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
            >
              Back to login
            </a>
          </p>
        </div>
      </form>
      <i
        className="ri-close-line login__close"
        id="forgot-close"
        onClick={onClose}
      ></i>
    </div>
  );
}

export default ForgotPass;
