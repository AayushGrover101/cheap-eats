import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { useProfilePicture } from '../context/ProfilePictureContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Edit() {
  const { currentUser } = useAuth();
  const { updateProfilePicture } = useProfilePicture();
  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('email@gmail.com');
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.username);
          setEmail(userData.email);
          setProfilePicture(userData.profilePicture || '/Images/default_pfp.jpeg'); // Use default URL if no profile picture
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [currentUser]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      setPreviewProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous message
    setError(''); // Clear previous error

    try {
      let profilePictureURL = profilePicture;
      if (newProfilePicture) {
        const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(storageRef, newProfilePicture);
        profilePictureURL = await getDownloadURL(storageRef);
      }

      // Update user profile picture
      await updateDoc(doc(db, "users", currentUser.uid), {
        profilePicture: profilePictureURL
      });

      // Update profile picture in all recipes authored by the user
      const recipesQuery = query(collection(db, "recipes"), where("authorId", "==", currentUser.uid));
      const querySnapshot = await getDocs(recipesQuery);
      const batch = writeBatch(db); // Create a batch instance
      querySnapshot.forEach((recipeDoc) => {
        batch.update(doc(db, "recipes", recipeDoc.id), { authorProfilePicture: profilePictureURL });
      });
      await batch.commit();

      setProfilePicture(profilePictureURL); // Update the state with the new profile picture URL
      setNewProfilePicture(null); // Reset the new profile picture state
      setPreviewProfilePicture(''); // Reset the preview profile picture state

      updateProfilePicture(profilePictureURL); // Update the profile picture in the context

      setMessage('Changes saved successfully.');
    } catch (error) {
      setError('Failed to save changes. ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="edit-form-container">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="profile-icon-container">
              <div className="profile-logo">
                {loading ? (
                  <img src="/Images/default_pfp.jpeg" alt="Loading" />
                ) : (
                  <img src={previewProfilePicture || profilePicture || "/Images/default_pfp.jpeg"} alt="Profile" />
                )}
              </div>
              <div className="edit-icon">
                <label htmlFor="profilePictureInput">
                  <img src="/Images/edit_icon.jpg" alt="edit icon" style={{ cursor: "pointer" }} />
                </label>
                <input type="file" id="profilePictureInput" style={{ display: "none" }} onChange={handleProfilePictureChange} />
              </div>
            </div>
            <div className="form-group" style={{ textAlign: "center" }}>
              <label htmlFor="name" className="input-label">Name: <img src="Images/lock_icon.png" alt="lock icon" style={{ width: "10px" }} /></label>
              <input type="name" id="name" name="name" value={name} readOnly className="edit-input" />
            </div>
            <div className="form-group" style={{ textAlign: "center" }}>
              <label htmlFor="email" className="input-label">Email: <img src="Images/lock_icon.png" alt="lock icon" style={{ width: "10px" }} /></label>
              <input type="email" id="email" name="email" value={email} readOnly className="edit-input" />
            </div>
            {error && <p style={{ color: 'red', fontSize: '14px', marginTop: "30px" }}>{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '14px', marginTop: "30px", marginBottom: "0px" }}>{message}</p>}
            <button className="edit-btn" type="submit">Submit Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit;
