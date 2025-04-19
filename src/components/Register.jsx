function Register({ show, onClose}) {
    return (
      <div className={`login ${show ? 'show-login' : ''}`} id="register">
        <form className="login__form">
          <h2 className="login__title">Register</h2>
  
          <div className="login__group">
            <div>
              <label htmlFor="name" className="login__label">Name</label>
              <input type="text" placeholder="Enter your name" id="name" className="login__input" />
            </div>
  
            <div>
              <label htmlFor="email" className="login__label">Email</label>
              <input type="email" placeholder="Enter your email" id="email" className="login__input" />
            </div>
  
            <div>
              <label htmlFor="password" className="login__label">Password</label>
              <input type="password" placeholder="Create a password" id="password" className="login__input" />
            </div>
          </div>
  
          <div>
            <button type="submit" className="login__button">Register</button>
  
            <p className="login__signup">
              Already have an account? <a href="#" onClick={onSwitchToLogin}>Log In</a>
            </p>
  
            <div className="login__divider">or</div>
  
            <button type="button" className="login__button login__google-button">
              <i className="ri-google-fill" style={{ marginRight: '8px' }}></i>
              Sign up with Google
            </button>
          </div>
        </form>
  
        <i className="ri-close-line login__close" id="register-close" onClick={onClose}></i>
      </div>
    )
  }
  
  export default Register
  