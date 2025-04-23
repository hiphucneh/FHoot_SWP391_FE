import { useEffect, useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';
import OTPpopup from './OTPpopup';

function Register({ show, onClose, onSwitchToLogin }) {
  const [accountType, setAccountType] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!show) {
      setAccountType(null);
      setShowOTP(false);
      setFormData({ name: "", email: "", password: "" });
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        setShowOTP(true);
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className={`login ${show ? "show-login" : ""}`} id="register">
      {accountType === null && (
        <div className="account-type-popup">
          <h2 className="login__title">Choose your account type</h2>
          <div className="account-type-options">
            <div className="account-card teacher" onClick={() => setAccountType("teacher")}>
              <div className="icon-circle"><i className="ri-book-open-line"></i></div>
              <p>Teacher</p>
            </div>
            <div className="account-card student" onClick={() => setAccountType("student")}>
              <div className="icon-circle"><i className="ri-user-line"></i></div>
              <p>Student</p>
            </div>
          </div>
          <p className="login__signup">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
          </p>
        </div>
      )}

      {accountType !== null && !showOTP && (
        <form className="login__form" onSubmit={handleRegister}>
          <h2 className="login__title">Sign Up as {accountType}</h2>

          <div className="login__group">
            <div>
              <label htmlFor="name" className="login__label">Name</label>
              <input type="text" id="name" placeholder="Enter your name" className="login__input" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="login__label">Email</label>
              <input type="email" id="email" placeholder="Write your email" className="login__input" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="login__label">Password</label>
              <input type="password" id="password" placeholder="Create a password" className="login__input" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div>
            <p className="login__signup">
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
            </p>
            <button type="submit" className="login__button">Sign Up</button>
          </div>
        </form>
      )}

      {showOTP && (
        <OTPpopup
          email={formData.email}
          onClose={() => setShowOTP(false)}
          onBack={() => setShowOTP(false)}
        />
      )}

      <i className="ri-close-line login__close" id="register-close" onClick={onClose}></i>
    </div>
  );
}

export default Register;
