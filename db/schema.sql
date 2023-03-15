CREATE DATABASE thebrickwall;

CREATE TABLE creations (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT,
    user_id INTEGER
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_digest TEXT
);