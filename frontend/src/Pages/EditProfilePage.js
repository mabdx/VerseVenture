import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./EditProfilePageStyle.css";
import NavBar from "./NavBar";
const EditProfilePage = () => {
  const { user_id, username, bio, profile_picture } = useParams();
  console.log("profile_picture: " + profile_picture);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedBio, setEditedBio] = useState(bio);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isPictureUploaded, setIsPictureUploaded] = useState(false);

  useEffect(() => {
    fetchData();
    setEditedUsername(username);
    if (bio === null || bio === undefined) {
      setEditedBio("");
    } else {
      setEditedBio(bio);
    }
  }, [user_id, username, bio, profile_picture]);

  async function fetchData() {
    const isAuthenticated = await checkUserAuthentication();
    console.log("isAuthenticated: " + isAuthenticated);
    if (isAuthenticated === -1) {
      window.location.href = "/";
      return;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      console.log("username: " + username);
      console.log("edited: " + editedUsername);

      if (editedUsername !== username) {
        formData.append("username", editedUsername);
      } else {
        formData.append("username", " ");
      }

      if (editedBio !== bio) {
        formData.append("bio", editedBio);
      } else {
        formData.append("bio", " ");
      }

      if (isPictureUploaded) {
        formData.append("profile_picture", newProfilePicture);
      } else {
        formData.append("profile_picture", null);
      }

      console.log("formData: " + formData);

      const response = await fetch("http://localhost:3001/Routes/EditProfile", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = `/UserProfilePage/${user_id}`;
      } else {
        console.error("Error while updating profile for user:", editedUsername);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleFileChange = (event) => {
    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setNewProfilePicture(reader.result);
    //     setIsPictureUploaded(true);
    //   };
    //   reader.readAsDataURL(file);
    // }
    if (event.target.files[0]) {
      setNewProfilePicture(event.target.files[0]);
      setIsPictureUploaded(true);
    }
  };

  return (
    <div className="edit-profile-container">
      <NavBar />
      <h1 className="edit-profile-heading">Edit Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="form-label">
          Username:
          <input
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Bio:
          <textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            className="form-textarea bio-textarea"
          />
        </label>
        <br />
        <label className="form-label">
          Current Profile Picture:
          {profile_picture ? (
            <img
              src={`http://localhost:3001/Images/${profile_picture}`}
              alt="Profile"
               className="profile-picture"
            />
          ) : (
            <p className="No-Profile-pic">No profile picture available</p>
          )}
        </label>
        <br />
        <label className="upload-image-edit-label">
          Upload New Profile Picture:
        </label>
        <input
          type="file"
          id="profile_picture"
          name="profile_picture"
          accept="image/*"
          onChange={handleFileChange}
          className="upload-image-edit"
        />
        {isPictureUploaded && (
          <p className="upload-message">Picture uploaded!</p>
        )}
        <br />
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
