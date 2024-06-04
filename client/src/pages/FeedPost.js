import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import "../Feed.css";

function FeedPost({ recipe }) {
  const { currentUser } = useAuth();
  const [isCollected, setIsCollected] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const formattedDate = recipe.timestamp?.seconds
    ? new Date(recipe.timestamp.seconds * 1000).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Date not available";

  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <div className="recipe-image" style={{ width: '350px', height: '350px' }}>
          <img
            src={recipe.imageUrl}
            alt={recipe.recipeName}
            onLoad={() => setImageLoaded(true)}
            style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}
          />
        </div>
        <div className="recipe-info">
          <div className="title-container">
            <h1>{recipe.recipeName}</h1>
            <img
              src={isCollected ? "Images/collections_filled.png" : "Images/collections_unfilled.png"}
              alt="Collection Icon"
              className="collection-icon"
              onClick={handleCollectionClick}
            />
          </div>
          <div className="profile-image">
            <img src={recipe.authorProfilePicture} alt="Profile" />
          </div>
          <p className="author">By {recipe.author} | {formattedDate}</p>
          <div className="hashtags">
            {recipe.hashtags && recipe.hashtags.map((hashtag, index) => (
              <span key={index} className="hashtag">{hashtag}</span>
            ))}
          </div>
          <p className="details">{recipe.timeTaken} | {recipe.servings} Servings | {recipe.price}</p>
          <div className="content-container">
            <div className="ingredients-section">
              <h2>Ingredients</h2>
              <div className="scrollable-content ingredients">
                <ul>
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="instructions-section">
              <h2>Instructions</h2>
              <div className="scrollable-content instructions">
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

export default FeedPost;
