import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import FeedPostEdit from "./FeedPostEdit";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';

function MyRecipes() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (currentUser) {
        const recipesRef = collection(db, "recipes");
        const userRecipesQuery = query(recipesRef, where("authorId", "==", currentUser.uid));
        const recipeDocs = await getDocs(userRecipesQuery);

        const recipeData = recipeDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Sort the recipes by timestamp on the client side
        recipeData.sort((a, b) => {
          const timestampA = a.timestamp?.seconds || 0;
          const timestampB = b.timestamp?.seconds || 0;
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
