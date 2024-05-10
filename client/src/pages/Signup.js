import React from 'react';

function Signup() {
  return (

    <div className="login-container">
      <div className="login-image">
        <div className="overlay"></div>
      </div>
      <div className="signup-form-container">
        <div className="login-form">
          <div className="signup-logo">
            <img src="/Images/logo.png" alt="Cheap Eats Logo" />
            <hr />
          </div>
          <div className="form-group">
            <input type="name" id="name" name="name" required placeholder="name." />
          </div>
          <div className="form-group">
            <input type="email" id="email" name="email" required placeholder="email." />
          </div>
          <div className="form-group">
            <input type="password" id="password" name="password" required placeholder="password." />
          </div>
          <button className="login-btn">Sign In</button>
          <p className="signup-link">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>

  );
}

export default Signup;