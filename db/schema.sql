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
    plot VARCHAR (200),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users (id) ON DELETE CASCADE
);

