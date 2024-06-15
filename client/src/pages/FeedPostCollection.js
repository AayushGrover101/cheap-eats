// Individual Post Sub-Component (shows up in main Collection component) - created to allow for unique styling

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import "../FeedCollection.css";

function FeedPostCollection({ recipe }) {
  const { currentUser } = useAuth();
  const [isCollected, setIsCollected] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch which recipes have been saved to collection based on Firebase Collection
  useEffect(() => {
    if (currentUser) {
      const fetchCollectionState = async () => {
        const collectionDoc = await getDoc(doc(db, `users/${currentUser.uid}/collections`, recipe.id));
        if (collectionDoc.exists()) {
          setIsCollected(true);
        }
      };
      fetchCollectionState();
    }
  }, [currentUser, recipe.id]);

  // Toggle collection state when user clicks collection button (also save the id and the time at which it was collected for sorting of collections page)
  const handleCollectionClick = async () => {
    if (currentUser) {
      const collectionRef = doc(db, `users/${currentUser.uid}/collections`, recipe.id);
      if (isCollected) {
        await deleteDoc(collectionRef);
      } else {
        await setDoc(collectionRef, { recipeId: recipe.id, timestamp: new Date() });
      }
      setIsCollected(!isCollected);
    } else {
      alert("Please log in to save recipes to your collection.");
    }
  };

  // Date formatting (string manipulation)
  const formattedDate = recipe.timestamp?.seconds
    ? new Date(recipe.timestamp.seconds * 1000).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Date not available";

  return (
    <div className="collections-recipe-container">
      <div className="collections-recipe-header">
        <div className="collections-recipe-image" style={{ width: '350px', height: '350px' }}>
          <img
            src={recipe.imageUrl}
            alt={recipe.recipeName}
            onLoad={() => setImageLoaded(true)}
            style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}
          />
        </div>
        <div className="collections-recipe-info">
          <div className="collections-title-container">
            <h1>{recipe.recipeName}</h1>
            <img
              src={isCollected ? "Images/collections_filled.png" : "Images/collections_unfilled.png"}
              alt="Collection Icon"
              className="collections-collection-icon"
              onClick={handleCollectionClick}
            />
          </div>
          <div className="collections-profile-image">
            <img src={recipe.authorProfilePicture} alt="Profile" />
          </div>
          <p className="collections-author">By {recipe.author} | {formattedDate}</p>
          <div className="collections-hashtags">
            {recipe.hashtags && recipe.hashtags.map((hashtag, index) => (
              <span key={index} className="collections-hashtag">{hashtag}</span>
            ))}
          </div>
          <p className="collections-details">{recipe.timeTaken} | {recipe.servings} Servings | {recipe.price}</p>
          <div className="collections-content-container">
            <div className="collections-ingredients-section">
              <h2>Ingredients</h2>
              <div className="collections-scrollable-content collections-ingredients">
                <ul>
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="collections-instructions-section">
              <h2>Instructions</h2>
              <div className="collections-scrollable-content collections-instructions">
                <ol>
                  {recipe.instructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPostCollection;
