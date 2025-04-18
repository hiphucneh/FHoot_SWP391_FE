function Login({ show, onClose }) {
  return (
    <div className={`login ${show ? 'show-login' : ''}`} id="login">
      <form className="login__form">
        <h2 className="login__title">Log In</h2>

        <div className="login__group">
          <div>
            <label htmlFor="email" className="login__label">Email</label>
            <input type="email" placeholder="Write your email" id="email" className="login__input" />
          </div>

          <div>
            <label htmlFor="password" className="login__label">Password</label>
            <input type="password" placeholder="Enter your password" id="password" className="login__input" />
          </div>
        </div>

        <div>
          <p className="login__signup">
            You do not have an account? <a href="#">Sign up</a>
          </p>
          <a href="#" className="login__forgot">You forgot your password</a>
          <button type="submit" className="login__button">Log In</button>
        </div>
      </form>

      <i className="ri-close-line login__close" id="login-close" onClick={onClose}></i>
    </div>
  )
}

export default Login
