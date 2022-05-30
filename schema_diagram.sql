CREATE TABLE Event (
   eventID INT,
   eventNAME VARCHAR (50),
   street_no VARCHAR (10),
   suburb VARCHAR (25),
   state VARCHAR (25),
   country VARCHAR (25),
   date DATE,
   time TIME,
   userID,
   PRIMARY KEY (eventID),
   FOREIGN KEY (userID) REFERENCES Users(userID)
);