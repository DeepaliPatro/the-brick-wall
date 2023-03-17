CREATE DATABASE thebrickwall;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_digest TEXT NOT NULL,
    about_me VARCHAR (150)
);

CREATE TABLE creations (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    about VARCHAR (250),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INT DEFAULT 0,
    comment VARCHAR(200),
    time_published TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creation_id INT REFERENCES creations (id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users (id) ON DELETE CASCADE
);