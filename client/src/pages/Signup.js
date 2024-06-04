import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if name, email, or password is empty
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password.length > 20) {
      setError("Password must be less than 20 characters long");
      return;
    }

    // Check if the username is taken
    const usernameRef = doc(db, "usernames", name);
    const docSnap = await getDoc(usernameRef);

    if (docSnap.exists()) {
      setError("Username is already taken");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const defaultProfilePicture = 'Images/default_pfp.jpeg';

      await updateProfile(user, { displayName: name });
      setCurrentUser({ ...user, displayName: name });

      await setDoc(usernameRef, { uid: user.uid });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Set the uid field to match the authenticated user ID
        username: name,
        email: email,
        profilePicture: defaultProfilePicture
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <div className="overlay"></div>
      </div>
      <div className="signup-form-container">
        <div className="login-form">
          <form onSubmit={onSubmit}>
            <div className="signup-logo">
              <img src="/Images/logo.png" alt="Cheap Eats Logo" />
              <hr />
            </div>

            <div className="form-group">
              <input type="name" id="name" name="name" required placeholder="username" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="password" id="password" name="password" required placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: "15px" }}>{error}</p>}
            <button className="login-btn" type="submit">Sign Up</button>
            <p className="signup-link">Already have an account? <NavLink to="/login">Log in</NavLink></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
