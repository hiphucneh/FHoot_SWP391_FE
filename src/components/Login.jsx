import './styles.css';
import 'remixicon/fonts/remixicon.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ show, onClose, onSwitchToRegister, onSwitchToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      setErrorMessage('');
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(
        'https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          body: JSON.stringify({
            email,
            password,
            fcmToken: 'web-client-placeholder',
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        const token = data.data.token; // hoặc data.token nếu token ở ngoài
  localStorage.setItem('token', token);
  window.location.href = '/Home';
      } else {
        setErrorMessage('Invalid Email or Password');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`login ${show ? 'show-login' : ''}`} id="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Log In</h2>

        <div className="login__group">
          <div>
            <label htmlFor="email" className="login__label">Email</label>
            <input
              type="email"
              id="email"
              className="login__input"
              placeholder="Write your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="login__label">Password</label>
            <input
              type="password"
              id="password"
              className="login__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px', marginBottom: '-10px' }}>
            {errorMessage}
          </p>
        )}

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="login__button">
            Log In
          </button>
        </div>

        <p className="login__signup">
          Don't have an account?{' '}
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
