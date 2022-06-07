INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);

SELECT email FROM users WHERE email = ?;

--inserting event details
--NOTE: last ? refers to req.session.user - would store this in a variable in routes
INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?);

--start_time and end_time are received from user input, last ? refers to the last inserted ID of the event table
--since connection to db will be made immediately after inserting event details
-- to get last inserted ID of event table, do SELECT LAST_INSERT_ID() FROM event;
INSERT INTO event_times (start_time, end_time, eventID) VALUES (?,?,?);

--testing getting details using inner join
SELECT users.first_name,users.last_name FROM users INNER JOIN event ON users.userID = event.userID WHERE eventID = 2;


/* Queries for dashboard */

-- Select statements

-- Events for ID of 1
INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES ("Birthday dinner", 15, "Truffle", "Bursburry", "South Australia", 5031, "Australia", CURDATE(), 1);
INSERT INTO event_times (start_time, end_time, eventID) VALUES ('08:00:00','10:00:00', 1);
INSERT INTO users_events VALUES (1, 1);

INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES ("Karaoke Night", 15, "Holsbrook", "Flinders", "South Australia", 5000, "Australia", CURDATE(), 1);
INSERT INTO event_times (start_time, end_time, eventID) VALUES ('08:00:00','10:00:00', 2);
INSERT INTO users_events VALUES (1, 2);

-- Getting an event and required details for a user
SELECT event.eventName,event.suburb,event.country,event.date,event_times.start_time FROM event INNER JOIN event_times ON event.eventID = event_times.eventID INNER JOIN users_events ON users_events.eventID = event.eventID WHERE users_events.userID = ?;
