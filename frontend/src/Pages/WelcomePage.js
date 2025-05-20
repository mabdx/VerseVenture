import React from "react";
import { Link } from "react-router-dom";
import "./WelcomeStyle.css";

function WelcomePage() {
  return (
    <div className="welcome-container">
      <img
        className="website-image"
        src="data:image/jpeg;base64,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"
        alt="Website Image"
      />
      <div className="welcome-content">
        <p className="welcome-description">
          Welcome to our article-sharing platform! Here, users can create and
          share their articles on various topics of interest. You can follow
          other users, like their articles, and engage in discussions through
          comments.
        </p>
        <div className="welcome-buttons">
          <Link to="/login" className="welcome-button">
            Login
          </Link>
          <Link to="/signup" className="welcome-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
