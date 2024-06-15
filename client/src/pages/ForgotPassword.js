// Forgot Password Page Component

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { NavLink } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Uses Firebase sendPasswordResetEmail function to enable forget password functionality
  const handleSubmit = async (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
        .then(() => {
            setMessage('Check your email to reset your password.');
        })
        .catch((error) => {
            setError('Failed to send password reset email. ' + error.message);
        });
  };

  return (

    <div className="login-container">
      <div className="login-image">
        <div className="overlay"></div>
      </div>
      <div className="login-form-container">
      
        <div className="login-form" style={{ marginTop: "10px" }}>
          <form onSubmit={handleSubmit}>

            <div className="signup-logo"  style={{ marginBottom: "45px" }}>
              <img src="/Images/logo.png" alt="Cheap Eats Logo" />
              <hr />
            </div>
            
            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder="email" onChange={(e)=>setEmail(e.target.value)} />
            </div>

            {/* This grabs error messages from Firebase and displays them in the HTML */}
            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: "15px" }}>{error}</p>}

            {/* This displays a success message if functionality is successful */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            
            <button className="login-btn">Reset Password</button>
            <p className="signup-link">Want to login? <NavLink to="/login"> Log in </NavLink></p>
          </form>

        </div>
        
      </div>
    </div>

  );
}

export default ForgotPassword;