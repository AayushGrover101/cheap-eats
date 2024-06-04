import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { db, storage } from '../firebase/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import "../Post.css";

function EditPost() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
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

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipeData(data);
        setRecipeName(data.recipeName);
        setTimeTaken(data.timeTaken);
        setServings(data.servings);
        setPrice(data.price);
        setIngredients(data.ingredients.join('\n'));
        setInstructions(data.instructions.join('\n'));
        setImagePreview(data.imageUrl);
        setHashtag1(data.hashtags[0] || "");
        setHashtag2(data.hashtags[1] || "");
        setHashtag3(data.hashtags[2] || "");
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    let imageUrl = imagePreview;

    if (image) {
      const oldImageRef = ref(storage, decodeURIComponent(recipeData.imageUrl.split('/o/')[1].split('?')[0]));
      try {
        await deleteObject(oldImageRef);
      } catch (error) {
        console.warn('Failed to delete old image:', error);
      }

      const uniqueImageName = `${uuidv4()}-${image.name}`;
      const imageRef = ref(storage, `images/${uniqueImageName}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const formattedHashtag1 = formatHashtag(hashtag1);
    const formattedHashtag2 = formatHashtag(hashtag2);
    const formattedHashtag3 = formatHashtag(hashtag3);

    const recipeDocRef = doc(db, "recipes", recipeId);

    await updateDoc(recipeDocRef, {
      recipeName,
      timeTaken,
      servings,
      price,
      hashtags: [formattedHashtag1, formattedHashtag2, formattedHashtag3],
      ingredients: ingredients.split('\n'),
      instructions: instructions.split('\n'),
      imageUrl,
    });

    navigate('/my-recipes');
  };

  if (!recipeData) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <form className="post-container" onSubmit={handleUpdate}>
        <div className="post-left-column">
          <div className="post-recipe-name">
            <input
              type="text"
              placeholder="Recipe Name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              maxLength="35"
              required
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
              style={{ display: "none" }}
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
              />
              <input
                type="text"
                placeholder="Hashtag 2 (eg. #lowcal)"
                value={hashtag2}
                onChange={(e) => setHashtag2(e.target.value)}
                maxLength="35"
                required
              />
              <input
                type="text"
                placeholder="Hashtag 3 (eg. #keto)"
                value={hashtag3}
                onChange={(e) => setHashtag3(e.target.value)}
                maxLength="35"
                required
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
              />
              <input
                type="text"
                placeholder="Servings (eg. 4)"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                maxLength="35"
                required
              />
              <input
                type="text"
                placeholder="$ Price (eg. $12)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                maxLength="35"
                required
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
              ></textarea>
            </div>
          </div>
          <div className="post-button">
            <button type="submit">Finish Edit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
