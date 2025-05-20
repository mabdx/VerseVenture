import React, { useState, useEffect } from "react";
import { checkUserAuthentication } from "../util/authUtil";
import "./AddArticlePageStyles.css";
import NavBar from "./NavBar";
function AddArticlePage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [articleImage, setArticleImage] = useState(null);
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  async function fetchData() {
    const isAuthenticated = await checkUserAuthentication();
    if (isAuthenticated === -1) {
      window.location.href = "/";
      return;
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/Routes/Categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Error fetching categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleArticleImageChange = (e) => {
    const file = e.target.files[0];
    setArticleImage(file);
  };

  const handleSubmit = async (status) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", title);
    formDataToSend.append("content", content);
    formDataToSend.append("category", selectedCategory);
    formDataToSend.append("status", status);
    if (articleImage) {
      formDataToSend.append("articleImage", articleImage);
    }

    try {
      const response = await fetch("http://localhost:3001/Routes/AddArticle", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setSaveMessage(data.message);
      } else {
        console.error("Error saving article:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
    }
  };

  return (
    <div><NavBar />
    <div className="add-article-container body">
      
      <h1 className="add-article-heading">Add Article</h1>
      {saveMessage && <p className="save-message">{saveMessage}</p>}
      <form className="article-form" encType="multipart/form-data">
        <div className="form-group">
          <label className="form-label" style={{ color: "#000" }}>
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ color: "#000" }}>
            Article Image:
          </label>
          <input
            type="file"
            name="articleImage"
            onChange={handleArticleImageChange}
            accept="image/*"
            required
            className="form-input visually-hidden"
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ color: "#000" }}>
            Content:
          </label>
          <textarea
            name="content"
            value={content}
            onChange={handleContentChange}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ color: "#000" }}>
            Category:
          </label>
          <select
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="form-select"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-buttons">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="save-button"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="publish-button"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default AddArticlePage;
