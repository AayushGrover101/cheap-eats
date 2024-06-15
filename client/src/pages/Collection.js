// Collection Page Component

import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import FeedPostCollection from "./FeedPostCollection";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import "../FeedCollection.css";

function Collection() {
  const { currentUser } = useAuth();

  // React state to store recipes from Firebase in array
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes from the user's saved recipes collection (sorted by order in which recipes were saved)
  useEffect(() => {
    const fetchCollections = async () => {
      if (currentUser) {
        const collectionsRef = collection(db, `users/${currentUser.uid}/collections`);
        const collectionDocs = await getDocs(collectionsRef);

        const recipePromises = collectionDocs.docs.map(async (collectionDoc) => {
          const recipeId = collectionDoc.data().recipeId;
          const timestamp = collectionDoc.data().timestamp;
          const recipeRef = doc(db, "recipes", recipeId);
          const recipeDoc = await getDoc(recipeRef);

          // Check if the recipe document exists
          if (recipeDoc.exists()) {
            return { id: recipeDoc.id, ...recipeDoc.data(), collectionTimestamp: timestamp };
          }
          return null;
        });

        const recipeData = (await Promise.all(recipePromises)).filter(recipe => recipe !== null);
        
        // Sort the recipes by the collection timestamp
        recipeData.sort((a, b) => b.collectionTimestamp - a.collectionTimestamp);
        
        setRecipes(recipeData);
      }
    };

    fetchCollections();
  }, [currentUser]);

  return (
    <div>
      <Navbar />
      <h1 style={{ marginLeft: "40px", marginTop: "30px", fontSize: "33px", marginBottom: "-15px" }}>My Collection</h1>
      {/* When there are no recipes in collection, display text */}
      {recipes.length === 0 ? (
        <p style={{ marginLeft: "40px", marginTop: "35px" }}>You have no saved recipes. Recipes you save on your feed will show up here...</p>
      ) : (
        recipes.map((recipe) => (
          <FeedPostCollection key={recipe.id} recipe={recipe} />
        ))
      )}
    </div>
  );
}

export default Collection;
