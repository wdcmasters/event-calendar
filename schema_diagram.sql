-- password won't actually be stored, it will be the hash generated from salt + password
CREATE TABLE users (
    userID INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50),
    password VARCHAR(50),
    PRIMARY KEY (userID)
    );

CREATE TABLE roles (
    userID INT,
    role VARCHAR(20),
    PRIMARY KEY (userID),
    FOREIGN KEY (role) REFERENCES users(userID)
    );

CREATE TABLE email_pref (
    email_settings_ID INT,
    notify_user_response VARCHAR(30),
    notify_all_confirm VARCHAR(30),
    notify_final_time VARCHAR(30),
    notify_cancelled_event VARCHAR(30),
    userID INT,
    PRIMARY KEY(email_settings_ID),
    FOREIGN KEY(userID) REFERENCES users(userID)
    );

CREATE TABLE event (
   eventID INT,
   eventNAME VARCHAR(50),
   street_no VARCHAR(10),
   suburb VARCHAR(25),
   state VARCHAR(25),
   country VARCHAR(25),
   date DATE,
   time TIME,
   userID INT,
   PRIMARY KEY (eventID),
   FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE users-events (
    userID INT,
    eventID INT,
    PRIMARY KEY 
)
