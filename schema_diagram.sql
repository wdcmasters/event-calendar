DROP SCHEMA IF EXISTS eventcalendar;
CREATE SCHEMA eventcalendar;
USE eventcalendar;

-- password won't actually be stored, it will be the hash generated from salt + password
CREATE TABLE users (
    userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50), -- if password field is null, then user has logged in with a gmail account
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
    notify_user_response BIT(1),
    notify_all_confirm BIT(1),
    notify_final_time BIT(1),
    notify_cancelled_event BIT(1),
    userID INT UNSIGNED NOT NULL,
    PRIMARY KEY(email_settings_ID),
    FOREIGN KEY(userID) REFERENCES users(userID) ON DELETE CASCADE
    );

CREATE TABLE event (
   eventID INT UNSIGNED NOT NULL AUTO_INCREMENT,
   eventName VARCHAR(50),
   street_no VARCHAR (25),
   street VARCHAR (25),
   suburb VARCHAR(25),
   state VARCHAR(25),
   post_code VARCHAR (10),
   country VARCHAR(25),
   date DATE,
   userID INT UNSIGNED NOT NULL,
   PRIMARY KEY (eventID),
   FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE event_times (
    timeID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    start_time TIME,
    end_time TIME,
    eventID INT UNSIGNED NOT NULL,
    PRIMARY KEY (timeID),
    FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE
);

CREATE TABLE users_events (
    userID INT UNSIGNED NOT NULL,
    eventID INT UNSIGNED NOT NULL,
    PRIMARY KEY (userID, eventID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE
);
