import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./DraftArticlePageStyle.css";
import NavBar from "./NavBar";
//data being sent to route is empty.

//add a button to delete a draft article
function DraftArticlePage() {
  const { article_id, user_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  //instead of all article data being set in one article object
  //have different states of each article data. like title
  //status.
  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }

    async function fetchArticle() {
      try {
        const response = await fetch(
          `http://localhost:3001/Routes/GetArticle/${user_id}/${article_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        if (data === null) {
          console.log("Article Not Found:");
        } else {
          setArticle(data[0]);
          setContent(data[0].content);
          setTitle(data[0].title);
          setSelectedCategory(data[0].category_name);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    fetchArticle();
    fetchCategories();
  }, [article_id, user_id]);

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

  const handleEdit = () => {
    setEditMode(true);
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

  const handleDeleteArticle = async (articleId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/Routes/DeleteArticle/${articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        window.alert("Article deleted successfully!");
      } else {
        window.alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      window.alert("An error occurred while deleting article");
    }
  };


  const handleSubmit = async (status) => {
    if (!title.trim()) {
      console.error("Title cannot be empty.");
      return;
    }
    if (!content.trim()) {
      console.error("Content cannot be empty.");
      return;
    }

    //fine
    const formDataToSend = new FormData();
    console.log("article_id: " + article_id);
    formDataToSend.append("article_id", article_id);
    console.log("user_id: " + user_id);
    formDataToSend.append("user_id", user_id);
    console.log("title: " + title);
    formDataToSend.append("title", title);
    console.log("content: " + content);
    formDataToSend.append("content", content);
    console.log("selectedCategory: " + selectedCategory);
    formDataToSend.append("selectedCategory", selectedCategory);
    console.log("status: " + status);
    formDataToSend.append("status", status);
    //fine
    console.log(
      "DATA BEING SENT:",
      formDataToSend.get("user_id"),
      formDataToSend.get("article_id"),
      formDataToSend.get("title"),
      formDataToSend.get("content"),
      formDataToSend.get("status")
    );
    try {
      const response = await fetch(
        "http://localhost:3001/Routes/UpdateArticle",
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("PAGE RECEIVED SUCCESS: " + data.success);
        }
        //setSaveMessage(data.message);
        setEditMode(false);
      } else {
        console.error("Error saving article:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="article-container">
        <h1
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          {editMode ? "Edit Article" : "Draft Article"}
        </h1>
        {isLoading ? (
          <p>Loading article...</p>
        ) : error ? (
          <p className="error-message">
            Error fetching article: {error.message}
          </p>
        ) : article === null ? (
          <p>No article found for the user.</p>
        ) : editMode ? (
          <div className="edit-mode" style={{ textAlign: "center" }}>
            <form>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "0.5rem" }}>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "0.5rem" }}>Content:</label>
                <textarea
                  name="content"
                  value={content}
                  onChange={handleContentChange}
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    minHeight: "200px", // Adjust height as needed
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: "0.5rem" }}>Category:</label>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%", // Fill the width of the container
                  }}
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
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    marginRight: "0.5rem",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("published")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                  }}
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            className="view-mode"
            style={{
              backgroundColor: "rgb(255, 228, 196)",
              borderRadius: "10px",
              padding: "2rem",
            }}
          >
            <h2
              style={{
                color: "black",
                fontSize: "2rem",
              }}
            >
              {article.title}
            </h2>

            <button
              onClick={() => handleDeleteArticle(article_id)}
              className="delete-article-button"
            >
              Delete Article
            </button>
            <p
              style={{
                padding: "0.5rem 0",
                fontSize: "1.25rem",
              }}
            >
              {article.content}
            </p>
            <p
              style={{
                padding: "0.5rem 0",
                fontSize: "1.25rem",
              }}
            >
              Category: {article.category_name}
            </p>
            <p
              style={{
                padding: "0.5rem 0",
                fontSize: "1.25rem",
              }}
            >
              Status: {article.status}
            </p>
            <p
              style={{
                padding: "0.5rem 0",
                fontSize: "1.25rem",
              }}
            >
              Date Posted: {article.date_posted}
            </p>
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DraftArticlePage;
