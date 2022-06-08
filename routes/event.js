var express = require('express');
var router = express.Router();

// router.post('/addevent', function(req, res, next) {

//     //Making sure all fields are filled
//     if (req.body.eventName == "" || req.body.street_no == ""||req.body.street == "" || req.body.city == ""||req.body.state == "" || req.body.post_code == ""||req.body.country == "" || req.body.date == ""||req.body.start_time == "" || req.body.fin_time == "")
//     {
//       console.log("Fill in the inputs");
//       res.sendStatus(404);
//       return;
//     }

// // do i need to check for this when opening connection?
//   if ('eventName' in req.body && 'street_no' in req.body){

//     //Opening connection
//     req.pool.getConnection(function(error,connection) {
//       if(error)
//       {
//         console.log(error);
//         res.sendStatus(500);
//         return;
//       }

//     // get user id from session (assuming theyre logged in)
//     // find where user id in the session matches w user id in the users table
//     // in events time table, insert start time and end time, and the user id is the user id from session
//     // when inserting the rest of the details into event table, may need to use inner join
//     // get last inserted time id and insert all the event details + time id into the event table


//     // how to generate eventID?
//     let query = "SELECT userID FROM users_events INNER JOIN users WHERE users.userID = users_events.userID INSERT INTO event (eventID, eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?,?);";
//     connection.query(query,[req.body.eventName, req.body.street_no, req.body.street, req.body.city, req.body.state, req.body.post_code, req.body.country, req.body.date, req.body.start_time , req.body.fin_time], function(error, rows, fields)
//     {
//         //Running query
//         connection.release(); // release connection
//         if (error) {
//           console.log(error);
//           console.log("Could not alert");
//           res.sendStatus(500);
//           return;

//         //Associating session with user and redirecting them to dashboard
//           // req.session.authenticated = true;
//           // req.session.user = { email: req.body.email, password: req.body.password };
//           // res.redirect("Dashboard.html");
//           // }
//           res.end();
//         });
//       });
//     }
//   });

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

// get event details from database
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


// get event details from database
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
        // if details exist, send the information
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
router.post('/respond/guest', function(req, res, next){
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

module.exports = router;