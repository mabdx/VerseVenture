import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./ViewLikedArticlesStyle.css";
import AOS from "aos";
import NavBar from "./NavBar";
function ViewLikedArticles() {
  const [likedArticles, setLikedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
  });
  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }

    async function fetchLikedArticles() {
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/GetLikedArticles"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch liked articles");
        }
        const data = await response.json();
        setLikedArticles(data.likedArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
        setLoading(false);
      }
    }

    fetchData();
    fetchLikedArticles();
  }, []);

  return (
    <div><NavBar />
    <div className="liked-articles-container">
      
      <h1 className="liked-articles-heading">Liked Articles</h1>
      {loading ? (
        <p>Loading liked articles...</p>
      ) : likedArticles.length === 0 ? (
        <p>No liked articles available.</p>
      ) : (
        <ul
          className="liked-articles-list"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {likedArticles.map((article) => (
            <li
              key={article.article_id}
              className="article-item"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <Link
                to={`/ArticlePage/${article.article_id}/${article.user_id}`}
                className="article-link"
              >
                <h3 style={{ color: "#000" }} className="article-title">
                  {article.title}
                </h3>
              </Link>

              <Link
                to={`/UserProfilePage/${article.user_id}`}
                className="author-link"
              >
                <p className="author">Author: {article.username}</p>
              </Link>

              <p className="date-posted">Date Posted: {article.date_posted}</p>
              <p className="category">Category: {article.category_name}</p>
              {/* <p className="user-id">User ID: {article.user_id}</p> */}
              {/* <p className="article-id">Article ID: {article.article_id}</p> */}
              <hr className="article-separator" />
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}

export default ViewLikedArticles;
