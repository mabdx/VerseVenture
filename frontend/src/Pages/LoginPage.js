import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginStyles.css";
//The Manager output displays before Database has even checked the user's existence
//the manager always returns that user exists I think error could be in async
function LoginPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/Routes/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Welcome To Login Page</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <input className="submit-button" type="submit" value="Login" />
      </form>
      <div className="message">{message}</div>
      <Link className="signup-link" to="/Signup">
        Go to Signup Page
      </Link>
    </div>

    // <div>
    //   <h1>Welcome To Login Page</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
    //     <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} required />
    //     <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
    //     <input type="submit" value="Login" />
    //   </form>
    //   <div>{message}</div>
    //   <Link to="/Signup">Go to Signup Page</Link>
    // </div>
  );
}

export default LoginPage;
