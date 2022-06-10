-- Sign up
INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);
SELECT LAST_INSERT_ID() AS lastID FROM users;

-- Log in
SELECT userID FROM users WHERE email = ? AND password = ?;
SELECT userID FROM users WHERE email = ?; -- check if user already in database for google login
SELECT LAST_INSERT_ID() AS userID FROM users;
INSERT INTO users (first_name, last_name, email) VALUES(?, ?, ?);

-- Getting/Modifying user account details
SELECT first_name FROM users WHERE userID = ?;
SELECT first_name, last_name, email FROM users WHERE userID = ?;
SELECT password FROM users WHERE userID = ?;
UPDATE users SET first_name = ?, last_name = ? WHERE userID = ?;
UPDATE users SET email = ? WHERE userID = ?;
UPDATE users SET password = ? WHERE userID = ?;


-- Event specific queries
SELECT event.eventID,event.eventName,event.street_no,event.street,event.suburb,event.country,event.date,event_times.start_time FROM event INNER JOIN event_times ON event.eventID = event_times.eventID INNER JOIN users_events ON users_events.eventID = event.eventID WHERE users_events.userID = ?;
SELECT MAX(eventID) AS last_id FROM event; --last insert id did not work
SELECT eventID FROM event WHERE eventID = ?;
SELECT eventName, street_no, street, suburb, state, post_code, country, date FROM event WHERE eventID = ?;
SELECT users.first_name,users.last_name FROM users INNER JOIN event ON users.userID = event.userID WHERE eventID = ?;
SELECT event_times.start_time, event_times.end_time, event.date FROM event_times INNER JOIN event ON event_times.eventID = event.eventID WHERE event_times.eventID = ?;
SELECT users.email FROM users WHERE userID = ?;
SELECT MAX(userID) AS user_id FROM users;

INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?);
INSERT INTO event_times (start_time, end_time, eventID, userID) VALUES (?,?,?,?);
INSERT INTO users_events (userID, eventID) VALUES (?,?);
INSERT INTO event_times (start_time, end_time, eventID, userID) VALUES (?,?,?,?);
INSERT INTO users (first_name, last_name) VALUES (?,?);

-- Admin queries
SELECT userID FROM roles WHERE userID = ?;
SELECT * FROM users;
INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);
SELECT * FROM event;


/* Testing Queries */

--inserting data to event table for testing retrieval of information
INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES ("Example bday", "136", "North tce", "Adelaide", "SA", "5000", "Australia", "2022-06-10", 1);

-- Events for ID of 1
INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES ("Birthday dinner", 15, "Truffle", "Bursburry", "South Australia", 5031, "Australia", CURDATE(), 1);
INSERT INTO event_times (start_time, end_time, eventID) VALUES ('08:00:00','10:00:00', 1);
INSERT INTO users_events VALUES (1, 1);

INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES ("Karaoke Night", 15, "Holsbrook", "Flinders", "South Australia", 5000, "Australia", CURDATE(), 1);
INSERT INTO event_times (start_time, end_time, eventID) VALUES ('08:00:00','10:00:00', 2);
INSERT INTO users_events VALUES (1, 2);

-- Getting an event and required details for a user
SELECT event.eventID,event.eventName,event.street_no,event.street,event.suburb,event.country,event.date,event_times.start_time FROM event INNER JOIN event_times ON event.eventID = event_times.eventID INNER JOIN users_events ON users_events.eventID = event.eventID WHERE users_events.userID = ?;
