create database WebProject;
use WebProject;
drop database WebProject;
-- Create User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
	profile_picture_filename TEXT,
    bio TEXT
);

CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO category (name) VALUES
('Music'),
('Entertainment'),
('Movies'),
('Programming'),
('Sports'),
('Racing');
select * from user;
select * from comment;
-- Create Article Table
CREATE TABLE Article (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    article_picture TEXT,
    status ENUM('draft', 'published') NOT NULL,
    category_id INT,
	date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    like_count INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);
select * from user;
select * from article;
-- Create Comment Table
CREATE TABLE Comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    article_id INT,
    content TEXT,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES Article(article_id) ON DELETE CASCADE
);

select * from LikedArticles;
-- Create Rating Table
CREATE TABLE LikedArticles (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    article_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES Article(article_id) ON DELETE CASCADE
);

-- Create Category Table

select * from category;

-- Create Followers Table
CREATE TABLE Followers (
    follower_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    follower_user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (follower_user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Inserting values into User table
INSERT INTO User (username, email, password, profile_picture_filename, bio) VALUES
('john_doe', 'john@example.com', 'password123', 'john_profile.jpg', 'Hello, I am John.'),
('alice_smith', 'alice@example.com', 'alicepass', 'alice_profile.jpg', 'I love coding and music.'),
('emma_jones', 'emma@example.com', 'emmapass', 'emma_profile.jpg', 'Sports enthusiast and movie buff.'),
('mike_roberts', 'mike@example.com', 'mikepass', 'mike_profile.jpg', 'Passionate about programming.'),
('sara_wilson', 'sara@example.com', 'sarapass', 'sara_profile.jpg', 'Racing is my life.');


INSERT INTO Category (name) VALUES
('Music'),
('Entertainment'),
('Movies'),
('Programming'),
('Sports'),
('Racing');

-- Inserting values into Article table
INSERT INTO Article (user_id, title, content, article_picture, status, category_id, like_count) VALUES
(1, 'Top 10 Music Albums of 2024', 'Here are the top 10 music albums of the year...', 'music_albums.jpg', 'published', 1, 150),
(2, 'Review: Latest Movie Releases', 'Check out our review of the latest movies...', 'latest_movies.jpg', 'published', 3, 98),
(4, 'Introduction to Python Programming', 'Python is a powerful programming language...', 'python_intro.jpg', 'draft', 4, 30),
(5, 'Formula 1 Grand Prix Recap', 'A summary of the latest Formula 1 race...', 'f1_recap.jpg', 'published', 6, 75);


-- Inserting values into Comment table
INSERT INTO Comment (user_id, article_id, content) VALUES
(2, 1, 'Great list! I particularly love the album at number 3.'),
(3, 2, 'I disagree with the review of the second movie. It was fantastic!'),
(1, 4, 'This is a helpful introduction. Looking forward to more tutorials!'),
(5, 4, 'Python is indeed versatile. Thanks for the article.');

-- Inserting values into LikedArticles table
INSERT INTO LikedArticles (user_id, article_id) VALUES
(1, 1),
(2, 3),
(4, 2),
(5, 4);

-- Inserting values into Followers table
INSERT INTO Followers (user_id, follower_user_id) VALUES
(1, 2),
(2, 4),
(3, 1),
(4, 5),
(5, 3);









