import './styles.css';
import 'remixicon/fonts/remixicon.css';

function Login({ show, onClose, onSwitchToRegister, onSwitchToForgot }) {
  return (
    <div className={`login ${show ? "show-login" : ""}`} id="login">
      <form className="login__form">
        <h2 className="login__title">Log In</h2>

        <div className="login__group">
          <div>
            <label htmlFor="email" className="login__label">Email</label>
            <input
              type="email"
              id="email"
              className="login__input"
              placeholder="Write your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="login__label">Password</label>
            <input
              type="password"
              id="password"
              className="login__input"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <p className="login__signup">
            Don't have an account?{" "}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}>
              Sign up
            </a>
          </p>
          <a href="#" className="login__forgot" onClick={(e) => {
            e.preventDefault();
            onSwitchToForgot();
          }}>
            Forgot your password?
          </a>
          <button type="submit" className="login__button">
            Log In
          </button>
        </div>

        <div className="login__google">
          <button className="login__google-button" type="button">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>
      </form>

      <i
        className="ri-close-line login__close"
        onClick={onClose}
      ></i>
    </div>
  );
}

export default Login;
