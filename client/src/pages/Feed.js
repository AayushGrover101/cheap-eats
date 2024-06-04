import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import FeedPost from "./FeedPost";
import Sidebar from "./Sidebar";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "../Feed.css";
import "../Sidebar.css";

function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [filters] = useState([
    'vegan', 'seafood', 'vegetarian', 'lowcal', 'keto', 
    'under10dollars', 'under20dollars', 'under30dollars', 
    'under10minutes', 'under20minutes', 'under30minutes',
    'italian', 'mexican', 'indian', 'eastasian', 'asian', 'japanese', 'korean', 'vietnamese'
  ]);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "recipes"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecipes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const filteredRecipes = selectedFilter
    ? recipes.filter((recipe) =>
        recipe.hashtags?.some(hashtag => hashtag.toLowerCase().includes(selectedFilter.toLowerCase()))
      )
    : recipes;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div className="feed-container">
        <div className="content">
          <Sidebar
            filters={filters}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
          <div className="feed">
            {filteredRecipes.map((recipe) => (
              <FeedPost key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
