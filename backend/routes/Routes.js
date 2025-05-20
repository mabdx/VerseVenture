const express = require("express");
const router = express.Router();
const config = require('../config');
const Manager = require('../classes/Manager');
const Database = require('../classes/Database');
const Article = require('../classes/Article');
const multer = require('multer');
const path = require('path');
const { stat } = require("fs");

router.post('/Login', async function(req, res, next) {
  const { email, username, password } = req.body;
  try {
    const { success, message } = await Database.loginUser(email,username,password);
    res.json({success, message});
  } catch (err) {
    console.error(`Error while filling form`, err.message);
    res.status(500).json({ success: false, message: 'An error occurred while logging in' });
  }
  
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, path.join(__dirname, '..', 'images')); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'profile_' + Date.now() + ext);
  }
});

const articleImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, path.join(__dirname, '..', 'images')); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'article_' + Date.now() + ext); 
  }
});

const upload = multer({ storage: storage });
const articleImageUpload = multer({ storage: articleImageStorage });


router.post("/Signup", upload.single("profile_picture"), async function (req, res, next) {
  const { email, username, password, bio } = req.body;
  const profilePicture = req.file ? req.file.filename : null;
  
  try {
    const { success, message } = await Manager.signupUser(
      email,
      username,
      password,
      profilePicture,
      bio
    );

    if (success) {
      console.log("User signed up successfully:", username);
    } else {
      console.error("Error while signing up user:", message);
    }

    res.json({ success, message });
  } catch (err) {
    console.error("Error while signing up user:", err.message);
    res.status(500).json({ success: false, message: "An error occurred while signing up" });
  }
});

router.get('/Categories', async function(req, res, next) {
  try {
    const categories = await Database.getCategories(); 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching categories' });
  }
});

router.post('/AddArticle', articleImageUpload.single("articleImage"), async function(req, res, next) {
  const { title, content, category, status } = req.body;
  const articleImage = req.file ? req.file.filename : null;

  try {
    const { success, message } = await Article.saveArticle(title, articleImage, content, category, status);
    res.json({ success, message });
  } catch (err) {
    console.error(`Error while saving article:`, err.message);
    res.status(500).json({ success: false, message: 'An error occurred while saving the article' });
  }
});

router.put('/UpdateArticle', async function(req, res, next) {
   const { article_id, user_id, title, content, selectedCategory, status } = req.body; 
    console.log("DATA IN UPDATE ARTICLE: "+ article_id, user_id, title, content, selectedCategory, status);
    try{
    const { success, message } = await Database.UpdateArticle(article_id, user_id, title, content, selectedCategory, status);
    res.json({ success, message });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({success: false, message: 'An error occurred while updating the article' });
  }
});

router.get('/GetOwnUserProfile', async function (req, res, next) {
  try {
    const userProfile = await Database.getOwnUserProfile();
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching own user profile:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred while fetching own user profile', data: null });
  }
});

router.get('/GetDraftArticles', async function(req, res, next) {
  try {
    const draftArticles = await Article.getDraftArticles();
    res.json(draftArticles);
  } catch (error) {
    console.error('Error fetching draft articles:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching draft articles' });
  }
});

router.get('/GetPublishedArticles', async function(req, res, next) {
  try {
    const publishedArticles = await Article.getPublishedArticles();
    res.json(publishedArticles);
  } catch (error) {
    console.error('Error fetching published articles:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching published articles' });
  }
});

router.get('/GetArticle/:userId/:articleId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const articleId = parseInt(req.params.articleId);
    const article = await Database.getArticleByID(userId, articleId);
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/GetProfile/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const article = await Database.getProfileByID(userId);
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/GetArticlesForHomePage', async function(req, res) {
  try {
    const homeArticles = await Database.getArticleForHomePage();
    res.json({ response: homeArticles });
  } catch (error) {
    console.error('Error fetching published articles:', error);
    res.status(500).json({ response: [] });
  }
});

router.get('/GetComments/:articleId', async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const userId = parseInt(req.params.userId);
    const comments = await Database.getCommentsByID(articleId, userId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/AddComment', async (req, res) => {
  try {
    const { article_id, content } = req.body;
    const result = await Database.addComment(article_id, content);
    res.json(result);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/GetArticlesByUserID/:userId', async function(req, res, next) {
  const { userId } = req.params;
  try {
    const articles = await Database.getPublishedArticlesByUserId(userId);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching articles' });
  }
});

router.get('/GetUserID', function(req, res, next) {
  try {
    const userid =  Database.getUserid();
    res.json(userid);
  } catch (error) {
    console.error('Error fetching user id:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching user id' });
  }
});

router.post('/DeleteComment/:comment_Id', async (req, res) => {
  try {
    const { comment_Id } = req.params;
    const result = await Database.deleteComment(comment_Id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/DeleteArticle/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const result = await Database.deleteArticle(articleId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/EditProfile', upload.single("profile_picture"), async function (req, res, next) {
  const { user_id, username, bio } = req.body;
  const profilePicture = req.file ? req.file.filename : null;
  console.log("Data Received By Edit Profile: " + user_id, username, bio, profilePicture);
  try {
    const { success, message } = await Database.updateProfile(user_id, username, bio, profilePicture);

    if (success) {
      console.log("Profile updated successfully for user:", username);
    } else {
      console.error("Error while updating profile for user:", username);
    }

    res.json({ success, message });
  } catch (err) {
    console.error("Error while updating profile:", err.message);
    res.status(500).json({ success: false, message: "An error occurred while updating profile" });
  }
});

router.post('/DeleteProfile/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await Database.deleteUserProfile(user_id);
    console.log("result: "+result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/Logout', async function(req, res, next) {
  try {
    const result = Database.logout();
    res.json(result);
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: 'An error occurred while logging out' });
  }
});

router.get('/IsLiked/:user_id/:article_id', async function(req, res, next) {
  const { user_id, article_id } = req.params;

  try {
    const isLiked = await Database.isLiked(user_id, article_id);
    res.json({ success: true, isLiked });
  } catch (error) {
    console.error('Error checking if article is liked:', error);
    res.status(500).json({ success: false, message: 'An error occurred while checking if article is liked' });
  }
});

router.post('/LikeArticle', async function(req, res, next) {
  const { user_id, article_id } = req.body;
  try {
    const liked = await Database.likeArticle(user_id, article_id);
    if (liked) {
      res.json({ success: true, message: 'Article liked successfully.' });
    } else {
      res.json({ success: false, message: 'Unable to like article.' });
    }
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ success: false, message: 'An error occurred while liking the article' });
  }
});

router.post('/UnlikeArticle', async function(req, res, next) {
  const { user_id, article_id } = req.body;
  try {
    const unliked = await Database.unlikeArticle(user_id, article_id);
    if (unliked) {
      res.json({ success: true, message: 'Article unliked successfully.' });
    } else {
      res.json({ success: false, message: 'Unable to unlike article.' });
    }
  } catch (error) {
    console.error('Error unliking article:', error);
    res.status(500).json({ success: false, message: 'An error occurred while unliking the article' });
  }
});

router.get('/GetLikedArticles', async (req, res) => {
  try {
    const likedArticles = await Database.getLikedArticles();
    res.json({ likedArticles });
  } catch (error) {
    console.error('Error getting liked articles:', error);
    res.status(500).json({ success: false, message: 'Error getting liked articles' });
  }
});

router.get('/isFollowingUser/:author_user_id', async (req, res) => {
  try {
    const author_user_id = req.params.author_user_id;
    const isFollowing = await Database.isFollowingUser(author_user_id);
    res.json({ isFollowing });
  } catch (error) {
    console.error('Error checking if the user is following the author:', error);
    res.status(500).json({ success: false, message: 'Error checking if the user is following the author' });
  }
});

router.post('/FollowUser/:author_user_id', async (req, res) => {
  try {
    const author_user_id = req.params.author_user_id;
    const success = await Database.followUser(author_user_id);
    if (success) {
      res.json({ success: true, message: 'User followed successfully.' });
    } else {
      res.status(500).json({ success: false, message: 'Unable to follow user.' });
    }
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'Error following user.' });
  }
});

router.delete('/UnfollowUser/:author_user_id', async (req, res) => {
  try {
    const author_user_id = req.params.author_user_id;
    const success = await Database.unfollowUser(author_user_id);
    if (success) {
      res.json({ success: true, message: 'User unfollowed successfully.' });
    } else {
      res.status(500).json({ success: false, message: 'Unable to unfollow user.' });
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ success: false, message: 'Error unfollowing user.' });
  }
});

router.get('/GetFollowingByUser', async (req, res) => {
  try {
    const followingUsers = await Database.getFollowingByUser();
    res.json({ followingUsers });
  } catch (error) {
    console.error('Error fetching following users:', error);
    res.status(500).json({ success: false, message: 'Error fetching following users.' });
  }
});



module.exports = router;
