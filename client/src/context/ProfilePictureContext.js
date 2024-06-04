import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

const ProfilePictureContext = createContext();

export const useProfilePicture = () => useContext(ProfilePictureContext);

export const ProfilePictureProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const defaultProfilePicture = '/Images/default_pfp.jpeg'; // Local URL of default profile picture
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

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
          } else {
            setProfilePicture(defaultProfilePicture);
          }
        }
      }
      setLoading(false);
    };

    fetchProfilePicture();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setProfilePicture(defaultProfilePicture);
    }
  }, [currentUser]);

  const updateProfilePicture = (url) => {
    setProfilePicture(url);
  };

  return (
    <ProfilePictureContext.Provider value={{ profilePicture, loading, updateProfilePicture }}>
      {children}
    </ProfilePictureContext.Provider>
  );
};
