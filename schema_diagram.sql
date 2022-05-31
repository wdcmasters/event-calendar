DROP SCHEMA IF EXISTS eventcalendar;
CREATE SCHEMA eventcalendar;
USE eventcalendar;

-- password won't actually be stored, it will be the hash generated from salt + password
CREATE TABLE users (
    userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50),
    password VARCHAR(50),
    PRIMARY KEY (userID)
    );

CREATE TABLE roles (
    userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    role VARCHAR(20),
    PRIMARY KEY (userID, role),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
    );

CREATE TABLE email_pref (
    email_settings_ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    notify_user_response VARCHAR(30),
    notify_all_confirm VARCHAR(30),
    notify_final_time VARCHAR(30),
    notify_cancelled_event VARCHAR(30),
    userID INT UNSIGNED NOT NULL,
    PRIMARY KEY(email_settings_ID),
    FOREIGN KEY(userID) REFERENCES users(userID) ON DELETE CASCADE
    );

CREATE TABLE event (
   eventID INT UNSIGNED NOT NULL AUTO_INCREMENT,
   eventNAME VARCHAR(50),
   street_no VARCHAR(10),
   suburb VARCHAR(25),
   state VARCHAR(25),
   country VARCHAR(25),
   date DATE,
   time TIME,
   userID INT UNSIGNED NOT NULL,
   PRIMARY KEY (eventID),
   FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE users_events (
    userID INT UNSIGNED NOT NULL,
    eventID INT UNSIGNED NOT NULL,
    PRIMARY KEY (userID, eventID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE
);
