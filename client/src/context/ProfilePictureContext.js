// This file ensures that profile picture changes are passed onto all 
// children components.This way, the edit page can change the profile picture 
// and each page can load the profile picture immediately without it having 
// to re-fetch each time.

// Note that ChatGPT helped identify that a context should be used for this
// use case and further helped with debugging the useEffect function in the
// ProfilePictureProvider.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

// Create a profile picture context
const ProfilePictureContext = createContext();

// Custom hook (will import useProfilePicture to access context)
export const useProfilePicture = () => useContext(ProfilePictureContext);

// Allows profile picture state to be passed onto children components
export const ProfilePictureProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const defaultProfilePicture = '/Images/default_pfp.jpeg'; 
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [loading, setLoading] = useState(true);

  // Fetch profile picture from the Firebase Storage
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        // If user has a profile picture, set the profilePicture state to it
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.profilePicture) {
            try {
              const storageRef = ref(storage, userData.profilePicture);
              const profilePictureURL = await getDownloadURL(storageRef);
              setProfilePicture(profilePictureURL);
            } catch (error) {
              console.error("Error fetching profile picture from Firebase Storage:", error);
              setProfilePicture(defaultProfilePicture);
            }
          } else { // If user does not have a profile picture, display default picture
            setProfilePicture(defaultProfilePicture);
          }
        }
      }
      setLoading(false);
    };

    fetchProfilePicture();

  }, [currentUser]); // Re-run for changes in current user

  // If user is not logged in, set profile picture to default profile picture
  useEffect(() => {
    if (!currentUser) {
      setProfilePicture(defaultProfilePicture);
    }
  }, [currentUser]);

  // Function to update the profile picture state
  const updateProfilePicture = (url) => {
    setProfilePicture(url);
  };

  return (
    // When you wrap components with ProfileProvider (we did this in Routes.js), it passes on the profile picture state to children components
    <ProfilePictureContext.Provider value={{ profilePicture, loading, updateProfilePicture }}>
      {children}
    </ProfilePictureContext.Provider>
  );
};
