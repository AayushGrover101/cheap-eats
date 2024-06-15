// This is the file that does all routing. It loads certain components 
// based on certain URLs, while also redirecting to different URLs 
// based on whether a user is logged in or not.

import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfilePictureProvider } from './context/ProfilePictureContext';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Feed from "./pages/Feed";
import Edit from "./pages/Edit";
import Collection from "./pages/Collection";
import Post from "./pages/Post";
import MyRecipes from "./pages/MyRecipes";
import EditPost from "./pages/EditPost";

// Navigate to the Login component if users are not logged in on private routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Navigate to the Feed component if users are attempting to access private routes while logged in
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" /> : children;
};

export const AppRoutes = () => {
  return (
    <AuthProvider> {/* Pass authentication state to children */ }
      <ProfilePictureProvider> {/* Pass profile picture state to children */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><Edit /></PrivateRoute>} />
            <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
            <Route path="/post" element={<PrivateRoute><Post /></PrivateRoute>} />
            <Route path="/edit-post/:recipeId" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/collection" element={<PrivateRoute><Collection /></PrivateRoute>} />
            <Route path='*' element={<PrivateRoute><Feed /></PrivateRoute>} />

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          </Routes>
        </BrowserRouter>
      </ProfilePictureProvider>
    </AuthProvider>
  );
};
