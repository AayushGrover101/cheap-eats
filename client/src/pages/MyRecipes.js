// My Recipes Page

import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import FeedPostEdit from "./FeedPostEdit";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';

function MyRecipes() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);

  // Fetch all recipes the user has posted from Firebase backend by querying recipes by AuthorID data
  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (currentUser) {
        const recipesRef = collection(db, "recipes");
        const userRecipesQuery = query(recipesRef, where("authorId", "==", currentUser.uid));
        const recipeDocs = await getDocs(userRecipesQuery);

        const recipeData = recipeDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Sort the recipes by timestamp (newly posted show first)
        recipeData.sort((a, b) => {

          // The seconds property tells you the number of seconds since January 1, 1970
          const timestampA = a.timestamp?.seconds || 0;
          const timestampB = b.timestamp?.seconds || 0;

          // Returns > 0 if timestampB > timestampA (puts B higher than A)
          return timestampB - timestampA;
        });

        setRecipes(recipeData);
      }
    };

    fetchUserRecipes();
  }, [currentUser]);

  return (
    <div>
      <Navbar />
      <h1 style={{ marginLeft: "40px", marginTop: "30px", fontSize: "33px", marginBottom: "-15px" }}>My Recipes</h1>
      {/* When there are no recipes posted by user, display text */}
      {recipes.length === 0 ? (
        <p style={{ marginLeft: "40px", marginTop: "35px" }}>You have no posted recipes. Recipes you post on the feed will show up here...</p>
      ) : (
        recipes.map((recipe) => (
          <FeedPostEdit key={recipe.id} recipe={recipe} />
        ))
      )}
    </div>
  );
}

export default MyRecipes;
