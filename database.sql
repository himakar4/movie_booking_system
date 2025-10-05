-- Create Database
CREATE DATABASE IF NOT EXISTS movie_booking_system;
USE movie_booking_system;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CINEMAS (Theaters)
CREATE TABLE cinemas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL
);

-- MOVIES
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  duration INT NOT NULL,               -- in minutes
  genre VARCHAR(100) NOT NULL,
  rating VARCHAR(10) NOT NULL,         -- U, UA, A
  release_date DATE NOT NULL,
  actors VARCHAR(255) NOT NULL,        -- comma separated actors
  poster VARCHAR(255) NOT NULL,        -- image path or URL
  description TEXT
);

-- LANGUAGES (Master table for languages)
CREATE TABLE languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- MOVIE-LANGUAGE Mapping (Many-to-Many)
CREATE TABLE movie_languages (
  movie_id INT,
  language_id INT,
  PRIMARY KEY (movie_id, language_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- SHOWS (Movie in Cinema at a Time)
CREATE TABLE shows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  cinema_id INT,
  show_time DATETIME NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

-- BOOKINGS (Who booked what)
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  show_id INT,
  seats VARCHAR(255) NOT NULL, -- e.g. "A1,A2,A3"
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

---------------------------------------------------------
-- SAMPLE DATA
---------------------------------------------------------

-- Insert sample Users
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2y$10$kQ9aB1hOHr5tTt9/0M1zAemH8DqZ0DMBsc4DKQghn7S3m4EJqUOV2'), -- user123
('Alice Smith', 'alice@example.com', '$2y$10$kQ9aB1hOHr5tTt9/0M1zAemH8DqZ0DMBsc4DKQghn7S3m4EJqUOV2'); -- user123

-- Insert Cinemas
INSERT INTO cinemas (name, location) VALUES
('PVR Cinemas', 'Hyderabad'),
('INOX Cinemas', 'Mumbai');

-- Insert Movies
INSERT INTO movies (title, duration, genre, rating, release_date, actors, poster, description) VALUES
('Inception', 148, 'Sci-Fi', 'UA', '2010-07-16', 'Leonardo DiCaprio, Joseph Gordon-Levitt', 'inception.jpg', 'A thief who steals secrets using dream-sharing technology.'),
('RRR', 182, 'Action/Drama', 'UA', '2022-03-25', 'N. T. Rama Rao Jr., Ram Charan', 'rrr.jpg', 'Two revolutionaries fight against colonial rule.'),
('3 Idiots', 170, 'Comedy/Drama', 'U', '2009-12-25', 'Aamir Khan, R. Madhavan, Sharman Joshi', '3idiots.jpg', 'Three friends navigate life and college together.'),
('Avengers: Endgame', 181, 'Action/Adventure', 'UA', '2019-04-26', 'Robert Downey Jr., Chris Evans, Scarlett Johansson', 'endgame.jpg', 'Superheroes unite to undo the damage caused by Thanos.');

-- Insert Languages
INSERT INTO languages (name) VALUES 
('English'), ('Hindi'), ('Telugu'), ('Tamil');

-- Map Movies to Languages
-- Inception = English, Hindi
INSERT INTO movie_languages (movie_id, language_id) VALUES (1, 1), (1, 2);

-- RRR = Telugu, Hindi, Tamil
INSERT INTO movie_languages (movie_id, language_id) VALUES (2, 3), (2, 2), (2, 4);

-- 3 Idiots = Hindi
INSERT INTO movie_languages (movie_id, language_id) VALUES (3, 2);

-- Avengers: Endgame = English
INSERT INTO movie_languages (movie_id, language_id) VALUES (4, 1);

-- Insert Shows
INSERT INTO shows (movie_id, cinema_id, show_time) VALUES
(1, 1, '2025-10-05 19:00:00'),
(2, 1, '2025-10-05 21:00:00'),
(3, 2, '2025-10-06 18:30:00'),
(4, 2, '2025-10-06 22:00:00');
