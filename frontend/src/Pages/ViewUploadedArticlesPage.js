import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./ViewUploadedArticlesPageStyles.css";
import NavBar from "./NavBar";
function ViewUploadedArticlesPage() {
  const [draftArticles, setDraftArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }

    async function fetchDraftArticles() {
      console.log("Draft articles before fetch:", draftArticles);
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/GetPublishedArticles"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch draft articles");
        }
        const data = await response.json();
        setDraftArticles(data);
      } catch (error) {
        console.error("Error fetching published articles:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    fetchDraftArticles();
  }, []);

  return (
    <div class="article-list">
      <NavBar />
      <h1 class="page-title">Published Articles</h1>
      {isLoading ? (
        <p class="loading-message">Loading published articles...</p>
      ) : error ? (
        <p class="error-message">
          Error fetching published articles: {error.message}
        </p>
      ) : draftArticles === null || draftArticles.length === 0 ? (
        <p class="no-articles-message">
          No published articles exist for the user.
        </p>
      ) : (
        <ul class="article-items">
          {draftArticles.map((article) => (
            <li key={article.article_id} class="article-item">
              <Link
                to={`/ArticlePage/${article.article_id}/${-2}`}
                class="article-link"
              >
                <h2 class="article-title">{article.title}</h2>
              </Link>
              <br></br>
              {article.article_picture && (
                <div class="image-container">
                  <img
                    src={`http://localhost:3001/Images/${article.article_picture}`}
                    alt={article.title}
                    class="article-image"
                  />
                </div>
              )}
              
              <p class="article-info">Category: {article.category_name}</p>
              <p class="article-info">Status: {article.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewUploadedArticlesPage;
