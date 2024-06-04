import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signOut } from "firebase/auth";
import { useProfilePicture } from '../context/ProfilePictureContext';

function Navbar() {
  const { profilePicture, loading } = useProfilePicture();
  const [activeLink, setActiveLink] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'feed';
    setActiveLink(path);

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);

  const setLinkActive = (link) => {
    setActiveLink(link);
    setDropdownOpen(false);
    navigate(link === 'feed' ? '/' : `/${link}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
      console.log("Signed out successfully");
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" 
        className={activeLink === 'feed' ? 'active' : ''} 
        onClick={() => setLinkActive('feed')}>
        <div className="navbar-logo">
          <img src="/Images/logo.png" alt="Cheap Eats Logo" />
        </div>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/" className={activeLink === 'feed' ? 'active' : ''} onClick={() => setLinkActive('feed')}>
            Feed
          </Link>
        </li>
        <li>
          <Link to="/collection" className={activeLink === 'collection' ? 'active' : ''} onClick={() => setLinkActive('collection')}>
            Collection
          </Link>
        </li>
        <li>
          <Link to="/post" className={activeLink === 'post' ? 'active' : ''} onClick={() => setLinkActive('post')}>
            Post +
          </Link>
        </li>
        <li className="profile-icon">
          <div className="dropdown-clickable" onClick={toggleDropdown}>
            {!loading && <img src={profilePicture} alt="Profile" />}
            {loading && <img src="/Images/default_pfp.jpeg" alt="Profile" />}
            <span className="dropdown-icon">&#9660;</span>
          </div>
          {dropdownOpen && (
            <ul className="dropdown-menu" ref={dropdownRef}>
              <li 
                onClick={() => { 
                  navigate("/my-recipes"); 
                  setLinkActive('my-recipes'); 
                  toggleDropdown(); 
                }} 
                className={activeLink === 'my-recipes' ? 'active' : ''}
              >
                My Recipes
              </li>
              <li 
                onClick={() => { 
                  navigate("/edit-profile"); 
                  setLinkActive('edit-profile'); 
                  toggleDropdown(); 
                }} 
                className={activeLink === 'edit-profile' ? 'active' : ''}
              >
                Edit Profile
              </li>
              <li onClick={handleLogout}>Log Out</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
