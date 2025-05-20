import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./ArticlePageStyle.css";
import NavBar from "./NavBar";
function ArticlePage() {
  const { article_id, user_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [articleOwner, setArticleOwner] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

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
          setArticleOwner(data[0].user_id);
        }

        const isLikedResponse = await fetch(
          `http://localhost:3001/Routes/IsLiked/${loggedInUser}/${article_id}`
        );
        if (!isLikedResponse.ok) {
          throw new Error("Failed to fetch like status");
        }
        const isLikedData = await isLikedResponse.json();
        setIsLiked(isLikedData.isLiked);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchUserProfile() {
      try {
        const response = await fetch(
          `http://localhost:3001/Routes/GetProfile/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error);
      }
    }

    async function fetchComments() {
      try {
        const response = await fetch(
          `http://localhost:3001/Routes/GetComments/${article_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error);
      }
    }

    async function fetchLoggedInUser() {
      try {
        const response = await fetch("http://localhost:3001/Routes/GetUserID", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch logged-in user");
        }
        const data = await response.json();
        setLoggedInUser(data);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
        setError(error);
      }
    }

    fetchData();
    fetchArticle();
    fetchUserProfile();
    fetchComments();
    fetchLoggedInUser();
  }, [article_id, user_id]);

  const handleSubmitComment = async () => {
    try {
      const response = await fetch("http://localhost:3001/Routes/AddComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article_id, content: newComment }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const data = await response.json();
      if (data.success) {
        window.alert("Comment added successfully!");
        setNewComment("");
        setComments([...comments, data]);
      } else {
        window.alert("Unable to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/Routes/DeleteComment/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        window.alert("Comment deleted successfully!");
        setComments(
          comments.filter((comment) => comment.comment_id !== commentId)
        );
      } else {
        window.alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      window.alert("An error occurred while deleting comment");
    }
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

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleLikeArticle = async () => {
    try {
      const response = await fetch("http://localhost:3001/Routes/LikeArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: loggedInUser, article_id }),
      });
      if (!response.ok) {
        throw new Error("Failed to like article");
      }
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking article:", error);
      setError(error);
    }
  };

  const handleUnlikeArticle = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/Routes/UnlikeArticle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: loggedInUser, article_id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unlike article");
      }
      setIsLiked(false);
    } catch (error) {
      console.error("Error unliking article:", error);
      setError(error);
    }
  };

  return (
    <div>
    <NavBar />
    <div className="article-page-container">
      
      {isLoading ? (
        <p>Loading article...</p>
      ) : error ? (
        <p className="error-message">Error fetching article: {error.message}</p>
      ) : article === null ? (
        <p>No article found.</p>
      ) : (
        <div>
          <p className="article-info article-page-title"> {article.title}</p>
          {loggedInUser === article.user_id && (
            <button
              onClick={() => handleDeleteArticle(article_id)}
              className="delete-article-button"
            >
              Delete Article
            </button>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {article.article_picture && (
              <img
                src={`http://localhost:3001/Images/${article.article_picture}`}
                alt={article.title}
                className="article-image"
              />
            )}
          </div>

          <p className="article-info">Date Posted: {article.date_posted}</p>
          <p className="article-info article-category">Category: {article.category_name}</p>
          <p className="article-info">Likes: {article.like_count1}</p>
          <br></br>
          <p className="article-info">Article Content: {article.content}</p>
          
          {articleOwner !== loggedInUser && (
            <div className="like-button-container">
              {isLiked ? (
                <button
                  className="unlike-button-"
                  onClick={handleUnlikeArticle}
                >
                  👎Unlike
                </button>
              ) : (
                <button className="like-button-" onClick={handleLikeArticle}>
                  👍Like
                </button>
              )}
            </div>
          )}
          
          {userProfile && (
            <div className="user-profile-info">
              <Link
                to={`/UserProfilePage/${userProfile.data.user_id}`}
                className="profile-link"
              >
                <p className="article-data Username-data">
                  Username: {userProfile.data.username}
                </p>
              </Link>
              {/* <p className="article-data ">ID: {userProfile.data.user_id}</p> 
            <p className="article-data email-data">
                Email: {userProfile.data.email}
              </p>
              <p className="article-data bio-data">
                Bio: {userProfile.data.bio}
              </p>*/}
              
              <img
                src={`http://localhost:3001/Images/${userProfile.data.profile_picture}`}
                alt="Profile"
                className="profile-picture"
              />
            </div>
          )}
          <div className="comments-section">
            <h2 className="comments-title">Comments</h2>
            {comments.length > 0 ? (
              <ul className="comment-list">
                {comments
                  .sort(
                    (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
                  )
                  .map((comment) => (
                    <li key={comment.comment_id} className="comment-item">
                      <p>{comment.content}</p>
                      <p>Comment Time: {comment.date_posted}</p>
                      <p style={{
                            fontWeight:"bold",
                          }}>{comment.username}</p>
                      {(articleOwner === loggedInUser ||
                        loggedInUser === comment.user_id) && (
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.comment_id)
                          }
                          className="delete-comment-button"
                          style={{
                            marginLeft: "0",
                            marginTop: "0.5rem",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <div className="add-comment-section">
            <input
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              className="comment-input"
            />
            <button
              onClick={handleSubmitComment}
              className="add-comment-button"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default ArticlePage;
