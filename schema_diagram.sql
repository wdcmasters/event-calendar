-- password won't actually be stored, it will be the hash generated from salt + password
CREATE TABLE Users (userID INT, first_name VARCHAR(30), last_name VARCHAR(30), email VARCHAR(50), password VARCHAR(50), PRIMARY KEY (userID));

CREATE TABLE Roles (userID INT, role VARCHAR(20), PRIMARY KEY (userID), FOREIGN KEY (role));

CREATE TABLE Email_P

CREATE TABLE Event (
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
   FOREIGN KEY (userID) REFERENCES Users(userID)
);
