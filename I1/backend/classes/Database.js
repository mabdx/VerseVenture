const mysql = require('mysql2/promise');
const config = require('../config');
let loggedInUserId  = -1;  

async function query(sql, params) {
  let connection;
  try {
    connection = await mysql.createConnection(config.Database);
  
    const [results] = await connection.execute(sql, params);

    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) {
      connection.end(); 
    }
  }
}

async function getCategories() {
  try {
    const sql = `SELECT name FROM Category`;
    const categories = await query(sql);
    return categories.map(category => category.name);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function insertUser(email, username, password, profilePictureFilename, bio) {
  try {
    const sql = `
      INSERT INTO User (email, username, password, profile_picture_filename, bio) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [email, username, password, profilePictureFilename || null, bio || null];
    const connection = await mysql.createConnection(config.Database);
    const [result] = await connection.execute(sql, params);

    if (result.affectedRows > 0) {
      loggedInUserId = result.insertId;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

async function isUserUnique(username, email) {
  try {
    const existingUser = await query(`SELECT * FROM User WHERE username = '${username}' OR email = '${email}'`);
    if(existingUser.length > 0){
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking user uniqueness:', error);
    throw error;
  }
}

async function loginUser(email, username, password) {
  if(!username && !email){
    return { success: false, message: "Invalid: Username and Email Both cannot be empty." };
  }
  try {
    const getUserIdSql = `SELECT user_id FROM User WHERE username = ? AND  email= ? AND password = ?`;
    const getUserIdParams = [username, email, password];
    const getUserIdResults = await query(getUserIdSql, getUserIdParams);
      
    if (getUserIdResults.length > 0) {
      loggedInUserId = getUserIdResults[0].user_id;
      return { success: true, message: "User successfully logged in." };
    } else {
      return { success: false, message: "Invalid username or password." }; 
    }
  } catch (error) {
    console.error('Error checking user credentials:', error);
    return { success: false, message: "Error during user login." };
  }

}

function getUserid(){
  return loggedInUserId;
}

async function insertArticle(title, article_picture, content, category, status) {
  try {
    const getCategorySql = `SELECT category_id FROM Category WHERE name = ?`;
    const getCategoryParams = [category];
    const categoryResult = await query(getCategorySql, getCategoryParams);
    if (categoryResult.length === 0) {
      console.error('Category not found.');
      return { success: false, message: 'Category not found.' };
    }
    const categoryId = categoryResult[0].category_id;
    const existingArticleSql = `SELECT article_id FROM Article WHERE user_id = ? AND title = ?`;
    const existingArticleParams = [loggedInUserId, title];
    const existingArticleResult = await query(existingArticleSql, existingArticleParams);

    if (existingArticleResult.length > 0) {
      const updateSql = `
        UPDATE Article
        SET content = ?, article_picture = ?, category_id = ?, status = ?
        WHERE user_id = ? AND title = ?
      `;
      const updateParams = [content, article_picture || null, categoryId, status, loggedInUserId, title];
      const updateResult = await query(updateSql, updateParams);
      if (updateResult.affectedRows > 0) {
        return { success: true, message: 'Article updated successfully.' };
      } else {
        return { success: false, message: 'Unable to update article.' };
      }
    } else {
      const insertSql = `
        INSERT INTO Article (user_id, title, content, article_picture, category_id, status) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const insertParams = [loggedInUserId, title, content, article_picture || null, categoryId, status];
      const insertResult = await query(insertSql, insertParams);
      if (insertResult.affectedRows > 0) {
        return { success: true, message: 'Article inserted successfully.', articleId: insertResult.insertId };
      } else {
        return { success: false, message: 'Unable to insert article.' };
      }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while inserting/updating article.' };
  }
}

async function getOwnUserProfile() {
  try {
    const userId = getUserid();
    if (userId == -1) {
      return { success: false, message: 'An error occurred while fetching user profile', data: null };
    }
    const sql = `SELECT username, email, bio, profile_picture_filename AS profile_picture FROM User WHERE user_id = ?`; // Include profile_picture_filename
    const params = [userId];
    const userData = await query(sql, params);

    if (userData.length > 0) {
      return { success: true, data: userData[0] };
    } else {
      return { success: false, message: 'User not found', data: null };
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while fetching user profile', data: null };
  }
}

async function GetDraftArticles() {
  try {
    const sql = `
      SELECT A.*, C.name AS category_name
      FROM Article A
      JOIN Category C ON A.category_id = C.category_id
      WHERE A.user_id = ? AND A.status = 'draft'
    `;
    const params = [loggedInUserId];
    const draftArticles = await query(sql, params);

    if (draftArticles.length > 0) {
      return draftArticles;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching draft articles:', error);
    throw error;
  }
}

async function getArticleByID(userId, articleId){
  try {
    if(userId == -2){
      userId = loggedInUserId; 
    }
    const sql = `
      SELECT A.*, C.name AS category_name, 
      (SELECT COUNT(*) FROM LikedArticles WHERE article_id = A.article_id) AS like_count1
      FROM Article A
      JOIN Category C ON A.category_id = C.category_id
      WHERE A.user_id = ? AND A.article_id = ?
    `;
    const params = [userId, articleId];
    const article = await query(sql, params);
     if (article.length > 0) {
      return article;
    } else {
      return null;
    }
    } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

async function GetPublishedArticles() {
  try {
   const sql = `
      SELECT A.*, C.name AS category_name
      FROM Article A
      JOIN Category C ON A.category_id = C.category_id
      WHERE A.user_id = ? AND A.status = 'published'
    `;
    const params = [loggedInUserId];
    const publishedArticles = await query(sql, params);

    if (publishedArticles.length > 0) {
      return publishedArticles;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching published articles:', error);
    throw error;
  }
}

async function UpdateArticle(article_id, user_id, title, content, category, status) {
   console.log("DATA IN Database: "+ article_id, user_id, title, content, category, status);
  try {
    const getCategorySql = `SELECT category_id FROM Category WHERE name = ?`;
    const getCategoryParams = [category];
    const categoryResult = await query(getCategorySql, getCategoryParams);

    if (categoryResult.length === 0) {
      console.error('Category not found.');
      return { success: false, message: 'Category not found.' };
    }

    const categoryId = categoryResult[0].category_id;
    const existingArticleSql = `SELECT article_id FROM Article WHERE user_id = ? AND article_id = ?`;
    const existingArticleParams = [user_id, article_id];
    const existingArticleResult = await query(existingArticleSql, existingArticleParams);

    if (existingArticleResult.length === 0) {
      console.error('Article not found for the user.');
      return { success: false, message: 'Article not found for the user.' };
    }

    // Update the article
    const updateSql = `
      UPDATE Article
      SET title = ?, content = ?, category_id = ?, status = ?
      WHERE article_id = ? AND user_id = ?
    `;
    const updateParams = [title, content, categoryId, status, article_id, user_id];
    const updateResult = await query(updateSql, updateParams);
    if (updateResult.affectedRows > 0) {
      return { success: true, message: 'Article updated successfully.' };
    } else {
      console.error('Unable to update article.');
      return { success: false, message: 'Unable to update article.' };
    }
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: false, message: 'An error occurred while updating article.' };
  }
}

async function getArticleForHomePage() {
  try {
    const sql = `
      SELECT A.article_id, A.title, A.content, A.date_posted, U.user_id, U.username, C.name AS category_name
      FROM Article A
      JOIN User U ON A.user_id = U.user_id
      JOIN Category C ON A.category_id = C.category_id
      WHERE A.status = 'published' AND A.user_id != ?
      ORDER BY A.date_posted DESC
    `;
    const params = [loggedInUserId];
    const homeArticles = await query(sql, params);

    if (homeArticles.length > 0) {
      return homeArticles;
    } else {
      console.log('No Home articles found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching Home articles:', error);
    throw error;
  }
}

async function getProfileByID(userid) {
  if(userid == -2){
    userid = loggedInUserId;
  }
  try {
    const sql = `
      SELECT U.user_id, U.username, U.email, U.bio, U.profile_picture_filename AS profile_picture,
             (SELECT COUNT(*) FROM Followers WHERE user_id = U.user_id) AS follower_count
      FROM User U
      WHERE U.user_id = ?
    `;
    const params = [userid];
    const userData = await query(sql, params);

    if (userData.length > 0) {
      return { success: true, data: userData[0] };
    } else {
      return { success: false, message: 'User not found', data: null };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, message: 'An error occurred while fetching user profile', data: null };
  }
}

async function getCommentsByID(articleId) {
  try {
    const sql = `
      SELECT Comment.*, User.username
      FROM Comment
      JOIN User ON Comment.user_id = User.user_id
      WHERE Comment.article_id = ?
    `;
    const params = [articleId];
    const comments = await query(sql, params);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

async function addComment(article_id, content) {
  try {
    const sql = `
      INSERT INTO Comment (user_id, article_id, content)
      VALUES (?, ?, ?)
    `;
    const params = [loggedInUserId, article_id, content];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return { success: true, message: 'Comment added successfully.' };
    } else {
      console.error('Unable to add comment.');
      return { success: false, message: 'Unable to add comment.' };
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

async function getPublishedArticlesByUserId(userId) {
  try {
    if(userId == -2){
      userId = loggedInUserId;
    }
    const sql = `SELECT * FROM Article WHERE user_id = ? AND status = 'published'`;
    const params = [userId];
    const articles = await query(sql, params);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

async function deleteComment(comment_id) {
  try {
    const sql = `
      DELETE FROM Comment
      WHERE comment_id = ?
    `;
    const params = [comment_id];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return { success: true, message: 'Comment deleted successfully.' };
    } else {
      console.error('Unable to delete comment.');
      return { success: false, message: 'Unable to delete comment.' };
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

async function deleteArticle(articleId) {
  try {
    const sql = `DELETE FROM Article WHERE article_id = ?`;
    const params = [articleId];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return { success: true, message: 'Article deleted successfully.' };
    } else {
      console.error('Unable to delete article:', articleId);
      return { success: false, message: 'Unable to delete article.' };
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}
async function updateProfile(user_id, username, bio, profilePictureFilename) {
  console.log("Data Received By Database: " + user_id, username, bio, profilePictureFilename);
  try {
      if(username !== " "){
        const isUnique = await isUserUnique(username);
        if (!isUnique) {
          return { success: false, message: 'Username is not unique.' };
        }
        
        const sql = `UPDATE User SET username = ? WHERE user_id = ?`;
        const params = [username, user_id];
        await query(sql, params);
      }
      
      if(bio !== " "){
       const sql = `UPDATE User SET bio = ? WHERE user_id = ?`;
       const params = [bio, user_id];
       await query(sql, params);
      }

      if(profilePictureFilename !== " " || profilePictureFilename !== null){
       const sql = `UPDATE User SET profile_picture_filename = ? WHERE user_id = ?`;
       const params = [profilePictureFilename, user_id];
       await query(sql, params);
      }
      return { success: true, message: 'Profile updated successfully.' };
   } catch (error) {
     console.error('Error updating profile:', error);
      return { success: false, message: 'Unable to update profile.' };
   }
}

async function deleteUserProfile(user_id) {
  try {
     const sql = `
      DELETE FROM User
      WHERE user_id = ?
    `;
    const params = [loggedInUserId];
    const result = await query(sql, params);
    if (result.affectedRows > 0) {
      return { success: true, message: 'Profile deleted successfully.' };
    } else {
      return { success: false, message: 'No profile found for the given user ID.' };
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

function logout() {
  loggedInUserId = -1;
  return loggedInUserId;
}

async function isLiked(user_id, article_id) {
  try {
    const sql = `
      SELECT COUNT(*) AS like_count
      FROM LikedArticles
      WHERE user_id = ? AND article_id = ?
    `;
    const params = [loggedInUserId, article_id];
    const result = await query(sql, params);

    return result[0].like_count > 0;
  } catch (error) {
    console.error('Error checking if the article is liked by the user:', error);
    throw error;
  }
}

async function likeArticle(user_id, article_id) {
  try {
    const sql = `
      INSERT INTO LikedArticles (user_id, article_id)
      VALUES (?, ?)
    `;
    const params = [loggedInUserId, article_id];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      console.log('Article liked successfully.');
      return true;
    } else {
      console.error('Unable to like article.');
      return false;
    }
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
}

async function unlikeArticle(user_id, article_id) {
  try {
    const sql = `
      DELETE FROM LikedArticles
      WHERE user_id = ? AND article_id = ?
    `;
    const params = [loggedInUserId, article_id];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return true;
    } else {
      console.error('Unable to unlike article.');
      return false;
    }
  } catch (error) {
    console.error('Error unliking article:', error);
    throw error;
  }
}

async function getLikedArticles() {
  try {
    const sql = `
      SELECT A.*, U.username, C.name AS category_name
      FROM LikedArticles L
      JOIN Article A ON L.article_id = A.article_id
      JOIN User U ON A.user_id = U.user_id
      JOIN Category C ON A.category_id = C.category_id
      WHERE L.user_id = ?
    `;
    const params = [loggedInUserId];
    const likedArticles = await query(sql, params);

    if (likedArticles.length > 0) {
      return likedArticles;
    } else {
      console.log('No liked articles found for the user.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching liked articles:', error);
    throw error;
  }
}

async function isFollowingUser(author_user_id) {
  try {
    const sql = `
      SELECT COUNT(*) AS follow_count
      FROM Followers
      WHERE user_id = ? AND follower_user_id = ?
    `;
    const params = [author_user_id, loggedInUserId];
    const result = await query(sql, params);

    return result[0].follow_count > 0;
  } catch (error) {
    console.error('Error checking if the user is following the author:', error);
    throw error;
  }
}

async function followUser(author_user_id) {
  try {
    const sql = `
      INSERT INTO Followers (user_id, follower_user_id)
      VALUES (?, ?)
    `;
    const params = [author_user_id, loggedInUserId];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return true;
    } else {
      console.error('Unable to follow user.');
      return false;
    }
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

async function unfollowUser(author_user_id) {
  try {
    const sql = `
      DELETE FROM Followers
      WHERE user_id = ? AND follower_user_id = ?
    `;
    const params = [author_user_id, loggedInUserId];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return true;
    } else {
      console.error('Unable to unfollow user.');
      return false;
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

async function getFollowingByUser() {
  try {
    const sql = `
      SELECT U.username, U.user_id, U.profile_picture_filename
      FROM Followers F
      JOIN User U ON F.user_id = U.user_id
      WHERE F.follower_user_id = ?
    `;
    const params = [loggedInUserId];
    const result = await query(sql, params);

    return result;
  } catch (error) {
    console.error('Error fetching following users:', error);
    throw error;
  }
}


module.exports = {
  query,
  insertUser,
  isUserUnique,
  loginUser,
  getCategories,
  insertArticle,
  getOwnUserProfile,
  GetDraftArticles,
  GetPublishedArticles,
  getArticleByID,
  UpdateArticle,
  getArticleForHomePage,
  getProfileByID,
  getCommentsByID,
  addComment,
  getPublishedArticlesByUserId,
  getUserid,
  deleteComment,
  deleteArticle,
  updateProfile,
  deleteUserProfile,
  logout,
  isLiked,
  likeArticle,
  unlikeArticle,
  getLikedArticles,
  isFollowingUser,
  followUser,
  unfollowUser,
  getFollowingByUser
};
