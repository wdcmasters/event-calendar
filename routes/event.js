var express = require('express');
var router = express.Router();

/* adds event details (excluding times) from add_event.html */
router.post('/add_event', function(req, res, next) {

    //Making sure all fields are filled
    if (req.body.eventName == "" || req.body.street_no == ""||req.body.street == "" || req.body.city == ""||req.body.state == "" || req.body.post_code == ""||req.body.country == "" || req.body.date == ""||req.body.start_time == "" || req.body.fin_time == "")
    {
      console.log("Fill in the inputs");
      res.sendStatus(404);
      return;
    }

    // connect to database
    req.pool.getConnection(function(error,connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }

      // insert event details
      let query = "INSERT INTO event (eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?);";
      connection.query(query,[req.body.eventName, req.body.street_no, req.body.street, req.body.suburb, req.body.state, req.body.post_code, req.body.country, req.body.date, req.session.user], function(error, rows, fields) {
        connection.release(); // release connection
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    });
});

var last_insert_eventid;

/* adds event times from add_event.html */
router.post('/add_event/times', function(req, res, next) {

  // connect to database
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    // get last inserted event id
    let query = "SELECT MAX(eventID) AS last_id FROM event;";
    connection.query(query, [req.body.start, req.body.end], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      last_insert_eventid = rows[0].last_id;
      req.session.eventID = last_insert_eventid;

      // connect to database to insert event times
      req.pool.getConnection(function(error,connection){
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }

        // insert event times
        let query = "INSERT INTO event_times (start_time, end_time, eventID, userID) VALUES (?,?,?,?);";
        connection.query(query,[req.body.start, req.body.end, last_insert_eventid, req.session.user], function(error, rows, fields) {
          connection.release(); // release connection
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        });
      });
    });
  });
});


/*Updating the users_events table */
router.get('/add_event/users_events', function(req, res, next) {
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    // insert event details
    let query = "INSERT INTO users_events (userID, eventID) VALUES (?,?);";
    connection.query(query,[req.session.user, last_insert_eventid], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// sends a 200 response if event id input on dashboard matches an event id in the database
router.post('/match_id', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT eventID FROM event WHERE eventID = ?;";
    connection.query(query,[req.body.eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // send 200 if id input matches id returned in response
      if (req.body.eventID == rows[0].eventID) {
        req.session.eventID = req.body.eventID;
        res.sendStatus(200);
      }
      else {
        //console.log(rows[0].eventID);
        res.sendStatus(404);
      }
    });
  });
});

// get event details from database
router.get('/get_details', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT eventName, street_no, street, suburb, state, post_code, country, date FROM event WHERE eventID = ?;";
    connection.query(query,[req.session.eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // if details exist, send the information
      if (rows.length > 0) {
        res.json(rows);
      }
      else {
        res.sendStatus(404);
      }
    });
  });
});

// get event id from session after creating event
router.get('/get_id', function(req, res, next) {
  res.json(req.session.eventID);
});

// // get event details from database
router.get('/get_host', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT users.first_name,users.last_name FROM users INNER JOIN event ON users.userID = event.userID WHERE eventID = ?;";
    connection.query(query,[req.session.eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // if details exist, send the information
      if (rows.length > 0) {
        res.json(rows);
      }
      else {
        res.sendStatus(404);
      }
    });
  });
});

// get event times from database
router.get('/get_times', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT event_times.start_time, event_times.end_time, event.date FROM event_times INNER JOIN event ON event_times.eventID = event.eventID WHERE event_times.eventID = ?;";
    connection.query(query,[req.session.eventID], function(error, rows, fields) { //req.session.eventID = id entered into search box
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // if details exist, send the information
      if (rows.length > 0) {
        res.json(rows);
      }
      else {
        res.sendStatus(404);
      }
    });
  });
});


// get gmail, event date, min time and max time
router.get('/get_gmail', function(req, res, next) {

  // only get gmail from database if user has session variable set to true
  if (req.session.gmail == true) {
    req.pool.getConnection(function(error,connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT users.email FROM users WHERE userID = ?;";
      connection.query(query,[req.session.user], function(error, rows, fields) {
        connection.release(); // release connection
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        // if details exist, send info
        if (rows.length > 0) {
          res.json(rows);
        }
        else {
          res.sendStatus(404);
        }
      });
    });
  }
  // no gmail, unauthorised
  else {
    res.sendStatus(401);
  }
});



// put guest information into database
router.post('/respond/guest', function(req, res, next) {
  if (req.body.first_name == "" || req.body.last_name == "")
     {
       console.log("Fill in the inputs");
       res.sendStatus(404);
       return;
     }
     if ('first_name' in req.body && 'last_name' in req.body) {
       //Opening connection
       req.pool.getConnection(function(error,connection) {
         if(error) {
           console.log(error);
           res.sendStatus(500);
           return;
         }

         let query = "INSERT INTO users (first_name,last_name) VALUES (?,?);"; //Inserting guest into db
         connection.query(query,[req.body.first_name, req.body.last_name], function(error, rows, fields)
         {
           //Running query
           connection.release(); // release connection
           if (error) {
             console.log(error);
             res.sendStatus(500);
             return;

             res.sendStatus(200);

           }

         });
       });
      }
      });

/* adds event times from add_event.html */
router.post('/respond/add_times', function(req, res, next) {

  // connect to database
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    // insert selected available times into database
    let query = "INSERT INTO event_times (start_time, end_time, eventID, userID) VALUES (?,?,?,?);";
    connection.query(query, [req.body.start, req.body.end, req.session.eventID, req.session.user], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


module.exports = router;