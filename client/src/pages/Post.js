import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import "../Post.css";

function Post() {
  const { currentUser } = useAuth();
  const [recipeName, setRecipeName] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [servings, setServings] = useState("");
  const [price, setPrice] = useState("");
  const [hashtag1, setHashtag1] = useState("");
  const [hashtag2, setHashtag2] = useState("");
  const [hashtag3, setHashtag3] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('Name');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.username);
          setProfilePicture(userData.profilePicture || '/Images/default_pfp.jpeg');
        }
      };
      fetchData();
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatHashtag = (tag) => {
    const lowercasedTag = tag.toLowerCase();
    return lowercasedTag.startsWith("#") ? lowercasedTag : `#${lowercasedTag}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      const uniqueImageName = `${uuidv4()}-${image.name}`;
      const imageRef = ref(storage, `images/${uniqueImageName}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const timestamp = new Date();

      const formattedHashtag1 = formatHashtag(hashtag1);
      const formattedHashtag2 = formatHashtag(hashtag2);
      const formattedHashtag3 = formatHashtag(hashtag3);

      const recipeDocRef = await addDoc(collection(db, "recipes"), {
        recipeName,
        timeTaken,
        servings,
        price,
        hashtags: [formattedHashtag1, formattedHashtag2, formattedHashtag3],
        ingredients: ingredients.split('\n'),
        instructions: instructions.split('\n'),
        imageUrl,
        author: name,
        authorProfilePicture: profilePicture,
        authorId: currentUser.uid,
        timestamp
      });

      await updateDoc(recipeDocRef, { id: recipeDocRef.id });

      window.location.reload();
    } catch (error) {
      console.error("Error posting recipe:", error);
      alert("Failed to post recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <form className="post-container" onSubmit={handleSubmit}>
        <div className="post-left-column">
          <div className="post-recipe-name">
            <input
              type="text"
              placeholder="Recipe Name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              maxLength="35"
              required
              disabled={loading}
            />
          </div>
          <div className="post-upload-image">
            <label htmlFor="imageUpload">
              <div className="post-upload-placeholder">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <>
                    <img src="Images/upload.png" alt="Upload" className="upload-icon" />
                    <div className="post-upload-text">
                      <p>Upload image here...</p>
                    </div>
                  </>
                )}
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
          <div className="post-details">
            <div className="post-details-column">
              <input
                type="text"
                placeholder="Hashtag 1 (eg. #asian)"
                value={hashtag1}
                onChange={(e) => setHashtag1(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Hashtag 2 (eg. #lowcal)"
                value={hashtag2}
                onChange={(e) => setHashtag2(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Hashtag 3 (eg. #keto)"
                value={hashtag3}
                onChange={(e) => setHashtag3(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
            </div>
            <div className="post-details-column">
              <input
                type="text"
                placeholder="Time (eg. 5 hours)"
                value={timeTaken}
                onChange={(e) => setTimeTaken(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Servings (eg. 4)"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="$ Price (eg. $12)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                maxLength="35"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <div className="post-right-column">
          <div className="post-ingredients-instructions">
            <div className="post-ingredients">
              <h3>Ingredients</h3>
              <textarea
                style={{ fontFamily: "'Proxima Nova', sans-serif", lineHeight: "1.6" }}
                placeholder="3 tbsp soy sauce&#10;1 teaspoon sugar"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                disabled={loading}
              ></textarea>
            </div>
            <div className="post-instructions">
              <h3>Instructions</h3>
              <textarea
                style={{ fontFamily: "'Proxima Nova', sans-serif", lineHeight: "1.6" }}
                placeholder="1. After washing basil and tomatoes, blot them dry with clean paper towel.&#10;2. Using a clean cutting board, cut tomatoes into quarters."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                disabled={loading}
              ></textarea>
            </div>
          </div>
          <div className="post-button">
            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Post;
