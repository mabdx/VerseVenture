import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./ViewFollowingUsersStyle.css";
import NavBar from "./NavBar";
function ViewFollowingUsers() {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(
          "http://localhost:3001/Routes/GetFollowingByUser"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch following users");
        }
        const data = await response.json();
        setFollowingUsers(data.followingUsers);
      } catch (error) {
        console.error("Error fetching following users:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCheck();
    fetchData();
  }, []);

  return (
    <div>    
    <NavBar />
    <div className="following-users-container">
     
      <h1 className="following-users-heading">Following Users</h1>
      {isLoading ? (
        <p>Loading following users...</p>
      ) : error ? (
        <p className="error-message">
          Error fetching following users: {error.message}
        </p>
      ) : followingUsers.length === 0 ? (
        <p>No users are being followed.</p>
      ) : (
        <ul className="user-list">
          {followingUsers.map((user) => (
            <li key={user.user_id} className="user-item">
              <Link
                to={`/UserProfilePage/${user.user_id}`}
                className="user-link"
              >
                <p className="username">Username: {user.username}</p>
              </Link>
              {/* <p className="user-id">User ID: {user.user_id}</p> */}
              {/* <p className="profile-picture">
                Profile Picture: {user.profile_picture_filename}
              </p> */}
              <img
                src={`http://localhost:3001/Images/${user.profile_picture_filename}`}
                alt="Profile"
                className="profile-image"
              />
              
            </li>
          ))}
        </ul>
      )}
    </div>
    </div> 
  );
}

export default ViewFollowingUsers;
