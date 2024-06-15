// Login Page Component

import React, { useState } from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { NavLink, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login user when login button pressed 
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/")
        console.log(user);
    })
    .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
    });
  
  }

  return (

    <div className="login-container">
      <div className="login-image">
        <div className="overlay"></div>
      </div>
      <div className="login-form-container">
      
        <div className="login-form">
          <form onSubmit={onLogin}>
            <div className="login-logo">
              <img src="/Images/logo.png" alt="Cheap Eats Logo" />
              <hr />
            </div>
            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder="email" onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="password" id="password" name="password" required placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
            </div>

            {/* This grabs error messages from Firebase and displays them in the HTML */}
            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: "15px" }}>{error}</p>}
            
            <button className="login-btn">Log In</button>
            <p className="signup-link">Don't have an account? <NavLink to="/signup"> Sign up </NavLink></p>
            <p className="forgot-link">Forgot your password? <NavLink to="/forgot-password"> Reset </NavLink></p>
          </form>

        </div>
        
      </div>
    </div>

  );
}

export default Login;