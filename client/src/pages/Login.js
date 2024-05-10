import React from 'react';

function Login() {
  return (

    <div className="login-container">
      <div className="login-image">
        <div className="overlay"></div>
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <div className="login-logo">
            <img src="/Images/logo.png" alt="Cheap Eats Logo" />
            <hr />
          </div>
          <div className="form-group">
            <input type="email" id="email" name="email" required placeholder="email." />
          </div>
          <div className="form-group">
            <input type="password" id="password" name="password" required placeholder="password." />
          </div>
          <button className="login-btn">Sign In</button>
          <p className="signup-link">Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>

  );
}

export default Login;