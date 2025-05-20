import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
import { checkUserAuthentication } from "../util/authUtil";
import "./HomePage.css";
import NavBar from "./NavBar";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }
    async function fetchArticles() {
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/GetArticlesForHomePage"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/Categories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Error fetching categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    }

    fetchData();
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "" && selectedCategory === "") {
      setFilteredArticles([]);
    } else {
      const filtered = articles.filter((article) => {
        const matchesSearch =
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "" || article.category_name === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      setFilteredArticles(filtered);
    }
  }, [searchTerm, selectedCategory, articles]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/Routes/Logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data === -1) {
        window.location.href = "/";
      } else {
        window.alert("Unable to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontSize: "20px",
        }}
      >
        <div>
          {" "}
          <img
            src="data:image/jpeg;base64,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"
            alt="Website Image"
            style={{
              height: "80px",
              width: "80px",
              borderRadius: "50%",
            }}
          />
        </div>
        <div>
          <Link to="/AddArticle" className="link">
            <button className="add-article-button add-article-button-font">
              Add Article
            </button>
          </Link>
          <Link to="/ViewUploadedArticles" className="link">
            <button className="view-uploaded-articles-button add-article-button-font">
              View Uploaded Articles
            </button>
          </Link>
          <Link to="/ViewDraftArticles" className="link">
            <button className="view-drafts-button add-article-button-font">
              View Drafts
            </button>
          </Link>
          <Link to={`/UserProfilePage/${-2}`} className="link">
            <button className="view-profile-button add-article-button-font">
              View Profile
            </button>
          </Link>
          <Link to="/ViewLikedArticles" className="link">
            <button className="view-liked-articles-button add-article-button-font">
              View Liked Articles
            </button>
          </Link>
          <Link to="/ViewFollowingUsers" className="link">
            <button className="view-following-button add-article-button-font">
              View Following
            </button>
          </Link>
          <Link to={`/Home`} className="link">
            <button className="view-profile-button add-article-button-font">
              Home
            </button>
          </Link>
        </div>
        <div>
          <Link>
            <button
              variant="contained"
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </Link>
        </div>
      </div>
      <div className="search-section">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search articles by title or username"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={clearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Loading articles...</p>
      ) : (
        <div>
          <h2
            className="all-articles-heading"
            style={{
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
            All Articles
          </h2>
          {(searchTerm.trim() === "" && selectedCategory === ""
            ? articles
            : filteredArticles
          ).length === 0 ? (
            <p className="no-articles-message">No articles available.</p>
          ) : (
            <ul
              className="article-list"
              style={{
                listStyleType: "none",
                padding: "1em",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(30%, 1fr)",
                gridGap: "20px",
              }}
            >
              {(searchTerm.trim() === "" && selectedCategory === ""
                ? articles
                : filteredArticles
              ).map((article) => (
                <li
                  key={article.article_id}
                  className="article-item"
                  style={{
                    backgroundColor: "#e9c8a0",
                    padding: "1em",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                >
                  <Link
                    to={`/ArticlePage/${article.article_id}/${article.user_id}`}
                    className="article-link"
                  >
                    <h3 className="article-title">{article.title}</h3>
                  </Link>
              
                  <p className="article-category">
                    Category: {article.category_name}
                  </p>
                  <p className="article-date">
                    Date Posted: {article.date_posted}
                  </p>
                  <Link
                    to={`/UserProfilePage/${article.user_id}`}
                    className="author-link"
                  >
                    <p className="article-author">Author: {article.username}</p>
                  </Link>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
