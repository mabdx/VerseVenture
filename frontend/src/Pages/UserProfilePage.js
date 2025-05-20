import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./UserProfilePageStyles.css";
import NavBar from "./NavBar";
function UserProfilePage() {
  const { user_id } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  useEffect(() => {
    async function fetchCheck() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }
    async function fetchData() {
      try {
        const userProfileResponse = await fetch(
          `http://localhost:3001/Routes/GetProfile/${user_id}`
        );
        const articlesResponse = await fetch(
          `http://localhost:3001/Routes/GetArticlesByUserID/${user_id}`
        );

        if (!userProfileResponse.ok || !articlesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const userProfileData = await userProfileResponse.json();
        const articlesData = await articlesResponse.json();

        setUserProfile(userProfileData);
        setArticles(articlesData);

        const loggedInUserData = await fetchLoggedInUserData();
        setLoggedInUser(loggedInUserData);

        if (
          loggedInUserData &&
          loggedInUserData.user_id !== userProfileData.data.user_id
        ) {
          const isFollowing = await fetchIsFollowingUser(
            userProfileData.data.user_id
          );
          setIsFollowingAuthor(isFollowing);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCheck();
    fetchData();
  }, [user_id]);

  async function fetchLoggedInUserData() {
    try {
      const loggedInUserResponse = await fetch(
        "http://localhost:3001/Routes/GetUserID"
      );
      if (!loggedInUserResponse.ok) {
        throw new Error("Failed to fetch logged-in user data");
      }
      return await loggedInUserResponse.json();
    } catch (error) {
      console.error("Error fetching logged-in user data:", error);
      return null;
    }
  }

  async function fetchIsFollowingUser(author_user_id) {
    try {
      const isFollowingResponse = await fetch(
        `http://localhost:3001/Routes/isFollowingUser/${author_user_id}`
      );
      if (!isFollowingResponse.ok) {
        throw new Error("Failed to check if the user is following the author");
      }
      const data = await isFollowingResponse.json();
      return data.isFollowing;
    } catch (error) {
      console.error(
        "Error checking if the user is following the author:",
        error
      );
      return false;
    }
  }

  async function handleFollowUnfollow() {
    try {
      if (isFollowingAuthor) {
        await fetch(
          `http://localhost:3001/Routes/UnfollowUser/${userProfile.data.user_id}`,
          { method: "DELETE" }
        );
        setIsFollowingAuthor(false);
      } else {
        await fetch(
          `http://localhost:3001/Routes/FollowUser/${userProfile.data.user_id}`,
          { method: "POST" }
        );
        setIsFollowingAuthor(true);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  }

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/Routes/DeleteProfile/${user_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          window.location.href = "/";
        } else {
          console.error("Error deleting profile:", data.message);
        }
      } catch (error) {
        console.error("Error deleting profile:", error.message);
      }
    }
  };
  return (
    <div><NavBar />
    <div style={{ backgroundColor: "#fff" }} className="user-profile-container">
      
      <h1 className="profile-heading">User Profile</h1>
      {isLoading ? (
        <p className="loading-message">Loading data...</p>
      ) : error ? (
        <p className="error-message">Error fetching data: {error.message}</p>
      ) : (
        <div>
          {loggedInUser &&
            userProfile &&
            loggedInUser !== userProfile.data.user_id && (
              <div className="follow-button-container">
                {!isFollowingAuthor ? (
                  <button
                    onClick={handleFollowUnfollow}
                    className="follow-button"
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    onClick={handleFollowUnfollow}
                    className="unfollow-button"
                  >
                    Unfollow
                  </button>
                )}
              </div>
            )}
          <div className="image-container">
            {userProfile.data.profile_picture ? (
              <img
                src={`http://localhost:3001/Images/${userProfile.data.profile_picture}`}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <p className="no-profile-picture">No profile picture available</p>
            )}
          </div>

          {userProfile && (
            <div className="user-details-container">
              <p className="username">Username: {userProfile.data.username}</p>
              <p className="email">Email: {userProfile.data.email}</p>
              {userProfile.data.bio ? (
                <p className="bio">Bio: {userProfile.data.bio}</p>
              ) : (
                <p className="no-bio">No bio added</p>
              )}

              <p className="follower-count">
                Followers: {userProfile.data.follower_count}
              </p>

              <div>
                {loggedInUser === userProfile.data.user_id && (
                  <Link
                    to={`/EditProfilePage/${userProfile.data.user_id}/${userProfile.data.username}/${userProfile.data.email}/${userProfile.data.bio}/${userProfile.data.profile_picture}`}
                    className="edit-profile-link"
                  >
                    <button className="edit-profile-button">
                      Edit Profile
                    </button>
                  </Link>
                )}
              </div>

              {loggedInUser === userProfile.data.user_id && (
                <div className="delete-profile-container">
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="delete-profile-button"
                  >
                    Delete Profile
                  </button>
                  {showConfirmation && (
                    <div className="confirmation-dialog">
                      <p>Are you sure you want to delete your profile?</p>
                      <button
                        onClick={handleDeleteProfile}
                        className="confirm-delete-button"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="cancel-delete-button"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <h2 className="articles-heading">Articles</h2>
          {articles.length > 0 ? (
            <ul className="article-list">
              {articles.map((article) => (
                <li key={article.article_id} className="article-item1">
                  <Link
                    to={`/ArticlePage/${article.article_id}/${article.user_id}`}
                    className="article-link"
                  >
                    <p className="article-title">
                      {article.title}
                    </p>
                  </Link>
                 
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-articles">No articles found.</p>
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default UserProfilePage;
