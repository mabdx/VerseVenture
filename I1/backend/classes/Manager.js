const Database = require('./Database');


async function signupUser(email, username, password, profilePicture, bio) {
  try {
    if (!username || username.length < 4 || !containsThreeAlphabets(username)) {
      return { success: false, message: "Invalid Username: Username must be at least 4 characters long and contain at least 3 alphabets." };
    }

    if (!password || password.length < 8) {
      return { success: false, message: "Invalid Password: Password must be at least 8 characters long." };
    }

    const isUnique = await Database.isUserUnique(username, email);

    if (!isUnique) {
      return { success: false, message: "Invalid User Credentials: Not Unique" };
    }

    const exists = await Database.insertUser(email, username, password, profilePicture, bio);
    if (exists) {
      return { success: true, message: "User successfully signed up." };
    } else {
      return { success: false, message: "Error occurred while inserting user." };
    }

  } catch (error) {
    console.error('Error during user signup:', error);
    return { success: false, message: "Error during user signup." };
  }
}

// function validateEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }

function containsThreeAlphabets(str) {
    const alphabetRegex = /[a-zA-Z]/g;
    return (str.match(alphabetRegex) || []).length >= 3;
}


module.exports = {
    signupUser
};
