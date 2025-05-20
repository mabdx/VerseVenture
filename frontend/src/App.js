import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import AddArticlePage from "./Pages/AddArticlePage";
import ViewOwnProfilePage from "./Pages/ViewOwnProfilePage";
import ViewDraftArticlesPage from "./Pages/ViewDraftArticlesPage";
import ViewUploadedArticlesPage from "./Pages/ViewUploadedArticlesPage";
import DraftArticlePage from "./Pages/DraftArticlePage";
import ArticlePage from "./Pages/ArticlePage";
import UserProfilePage from "./Pages/UserProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";
import ViewLikedArticles from "./Pages/ViewLikedArticles";
import ViewFollowingUsers from "./Pages/ViewFollowingUsers";
import WelcomePage from "./Pages/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/Home" element={<HomePage />} />
        <Route exact path="/Signup" element={<SignupPage />} />
        <Route exact path="/Login" element={<LoginPage />} />
        <Route exact path="/AddArticle" element={<AddArticlePage />} />
        <Route
          exact
          path="/ViewUploadedArticles"
          element={<ViewUploadedArticlesPage />}
        />
        <Route
          exact
          path="/ViewDraftArticles"
          element={<ViewDraftArticlesPage />}
        />
        <Route exact path="/ViewOwnProfile" element={<ViewOwnProfilePage />} />
        <Route
          path="/DraftArticlePage/:article_id/:user_id"
          element={<DraftArticlePage />}
        />
        <Route
          path="/ArticlePage/:article_id/:user_id"
          element={<ArticlePage />}
        />
        <Route path="/UserProfilePage/:user_id" element={<UserProfilePage />} />
        <Route
          path="/EditProfilePage/:user_id/:username/:email/:bio/:profile_picture"
          element={<EditProfilePage />}
        />
        <Route
          exact
          path="/ViewLikedArticles"
          element={<ViewLikedArticles />}
        />
        <Route
          exact
          path="/ViewFollowingUsers"
          element={<ViewFollowingUsers />}
        />
        <Route exact path="/" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
