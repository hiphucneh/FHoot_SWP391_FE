import { useEffect, useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';

function Register({ show, onClose, onSwitchToLogin }) {
  const [accountType, setAccountType] = useState(null);

  // Khi form bị đóng (show = false), reset lại accountType
  useEffect(() => {
    if (!show) {
      setAccountType(null);
    }
  }, [show]);

  return (
    <div className={`login ${show ? "show-login" : ""}`} id="register">
      {accountType === null && (
        <div className="account-type-popup">
          <h2 className="login__title">Choose your account type</h2>
          <div className="account-type-options">
            <div className="account-card teacher" onClick={() => setAccountType("teacher")}>
              <div className="icon-circle">
                <i className="ri-book-open-line"></i>
              </div>
              <p>Teacher</p>
            </div>
            <div className="account-card student" onClick={() => setAccountType("student")}>
              <div className="icon-circle">
                <i className="ri-user-line"></i>
              </div>
              <p>Student</p>
            </div>
          </div>
          <p className="login__signup">
            Already have an account?{" "}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}>
              Log in
            </a>
          </p>
        </div>
      )}

      {accountType !== null && (
        <form className="login__form">
          <h2 className="login__title">Sign Up as {accountType === "teacher" ? "Teacher" : "Student"}</h2>

          <div className="login__group">
            <div>
              <label htmlFor="name" className="login__label">Name</label>
              <input type="text" placeholder="Enter your name" id="name" className="login__input" />
            </div>
            <div>
              <label htmlFor="email" className="login__label">Email</label>
              <input type="email" placeholder="Write your email" id="email" className="login__input" />
            </div>
            <div>
              <label htmlFor="password" className="login__label">Password</label>
              <input type="password" placeholder="Create a password" id="password" className="login__input" />
            </div>
          </div>

          <div>
            <p className="login__signup">
              Already have an account?{" "}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}>
                Log in
              </a>
            </p>
            <button type="submit" className="login__button">Sign Up</button>
          </div>

          <div className="login__google">
            <button className="login__google-button" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="google-icon" />
              Continue with Google
            </button>
          </div>
        </form>
      )}

      <i className="ri-close-line login__close" id="register-close" onClick={onClose}></i>
    </div>
  );
}

export default Register;
