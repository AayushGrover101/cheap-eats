// Individual Post Sub-Component (shows up in main My Recipes component) - created to allow for unique edit/delete buttons

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import "../FeedCollection.css";

function FeedPostEdit({ recipe }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Navigates to unique edit page when edit button clicked
  const handleEdit = () => {
    navigate(`/edit-post/${recipe.id}`);
  };

  // Handle deletion functionality
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const recipeDocRef = doc(db, 'recipes', recipe.id);
        const imageRefPath = decodeURIComponent(recipe.imageUrl.split('/o/')[1].split('?')[0]);
        const imageRef = ref(storage, `images/${imageRefPath}`);

        // Delete the recipe document
        await deleteDoc(recipeDocRef);

        // Delete the image
        try {
          await deleteObject(imageRef);
        } catch (imageError) {
          console.warn('Failed to delete image:', imageError);
        }

        // Refresh to reflect deletion
        window.location.reload();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete the recipe. Please try again.');
      }
    }
  };

  // Date formatting (string manipulation)
  const formattedDate = recipe.timestamp?.seconds
    ? new Date(recipe.timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date not available';

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
              src={"Images/edit-icon.png"}
              alt="Edit Icon"
              className="collections-collection-icon"
              style={{ width: '17px', height: '17px', marginBottom: '21px' }}
              onClick={handleEdit}
            />
            <img
              src={"Images/delete-icon.png"}
              alt="Delete Icon"
              className="collections-collection-icon"
              style={{ width: '17px', height: '17px', marginBottom: '21px', opacity: '0.8' }}
              onClick={handleDelete}
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
              <div className="collections-scrollable-content collections-ingredients" style={{ marginTop: '-19px' }}>
                <ul>
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="collections-instructions-section">
              <h2>Instructions</h2>
              <div className="collections-scrollable-content collections-instructions" style={{ marginTop: '-19px' }}>
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

export default FeedPostEdit;
