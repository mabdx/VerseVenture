import React, { useState, useEffect } from "react";
import { checkUserAuthentication } from "../util/authUtil";
import "./ViewOwnProfilePageStyle.css";
import NavBar from "./NavBar";
function ViewOwnProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }

    async function fetchUserProfile() {
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/GetOwnUserProfile",
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

        if (data.success) {
          setProfileData(data.data);
        } else {
          setError(data.message || "Failed to fetch user profile");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching user profile"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="user-profile-container">
     <NavBar />
      <h2 className="profile-heading">User Profile</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {profileData.profile_picture && (
          <img
            src={`http://localhost:3001/Images/${profileData.profile_picture}`}
            alt="Profile Picture"
            className="profile-picture"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
      </div>

      {profileData && (
        <div className="profile-details">
          <p className="profile-info">Username: {profileData.username}</p>
          <p className="profile-info">Email: {profileData.email}</p>
          <p className="profile-info">Bio: {profileData.bio}</p>
        </div>
      )}
    </div>
  );
}

export default ViewOwnProfilePage;
