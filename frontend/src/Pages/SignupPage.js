import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignupStyles.css";

function SignupPage() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("bio", bio);

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await fetch("http://localhost:3001/Routes/Signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { success, message: responseMessage } = data;

      if (success) {
        window.location.href = "/Home";
      } else {
        setMessage(responseMessage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error fetching data");
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  return (
    <div class="signup-container">
      <h1 class="signup-heading">Welcome to SignUp Page</h1>
      <form
        class="signup-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label htmlFor="email">Email:</label>
        <br />
        <input
          class="input-field"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="Email Address"
        />
        <br />
        <label htmlFor="username">Username:</label>
        <br />
        <input
          class="input-field"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          required
          placeholder="Username"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          class="input-field"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          required
          placeholder="Password"
        />
        <br />
        <label htmlFor="profile_picture">Profile Picture:</label>
        <br />
        <div class="file-input-wrapper">
          <button class="file-input-button">Choose Profile Picture</button>
          <input
            class="input-field file-input"
            type="file"
            id="profile_picture"
            name="profile_picture"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </div>

        <br />
        <label htmlFor="bio">Bio:</label>
        <br />
        <textarea
          class="input-field"
          id="bio"
          name="bio"
          value={bio}
          onChange={handleBioChange}
          placeholder="Bio"
        ></textarea>
        <br />
        <br />
        <input class="submit-button" type="submit" value="Signup" />
      </form>
      <div class="message">{message}</div>
      <Link class="link" to="/Login">
        Go to Login Page
      </Link>
    </div>
  );
}

export default SignupPage;
