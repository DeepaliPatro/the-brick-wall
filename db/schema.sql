CREATE DATABASE thebrickwall;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_digest TEXT
);

CREATE TABLE creations (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT,
    about VARCHAR (250),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INT,
    comment VARCHAR(200),
    time_published TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creation_id INT REFERENCES creations (id) ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON DELETE CASCADE
);