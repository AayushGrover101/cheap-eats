// The purpose of this context file is to pass authentication states
// between the various pages of our application. We use this wrapper in
// the Routes.js file, where each component can change authentication
// state (eg. login/logout/sign up) or access authentication details (eg. display username).

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create an authentication context
const AuthContext = createContext();

// Custom hook (will import useAuth to access context)
export const useAuth = () => useContext(AuthContext);

// Allows authentication state to be passed onto children components
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When authentication state changes, update the current user (eg. login / logout)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Allows children component to view current user and change current user
    const value = {
      currentUser,
      setCurrentUser
    };

    // When you wrap components with AuthProvider (we did this in Routes.js), it passes on authentication state to children components
    return (
      <AuthContext.Provider value={value}>
        {/* This renders children components when authentication is not loading */}
        {!loading && children}
      </AuthContext.Provider>
    );
};