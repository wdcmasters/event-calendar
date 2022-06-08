var express = require('express');
var router = express.Router();

router.post('/addevent', function(req, res, next) {

    //Storing the event details
    // let eventName = req.body.eventName;
    // let street_no = req.body.street_no;
    // let street = req.body.street;
    // let city = req.body.city;
    // let state = req.body.state;
    // let post_code = req.body.post_code;
    // let country = req.body.country;
    // let date = req.body.date;
    // let start_time = req.body.start_time;
    // let fin_time = req.body.fin_time;

    //Parsing  (do later)
    //
    //

    //Making sure all fields are filled
    if (req.body.eventName == "" || req.body.street_no == ""||req.body.street == "" || req.body.city == ""||req.body.state == "" || req.body.post_code == ""||req.body.country == "" || req.body.date == ""||req.body.start_time == "" || req.body.fin_time == "")
    {
      console.log("Fill in the inputs");
      res.sendStatus(404);
      return;
    }

// do i need to check for this when opening connection?
  if ('eventName' in req.body && 'street_no' in req.body)
  {
    //Opening connection
    req.pool.getConnection(function(error,connection)
    {
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      }

    // how to generate eventID?
    // req.session.user

    let event_query = "INSERT INTO event_times (eventID, eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?,?);";
    timeID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    start_time TIME,
    end_time TIME,
    eventID INT UNSIGNED NOT NULL,

    let query = "INSERT INTO event (eventID, eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?,?);";
    connection.query(query,[req.body.eventName, req.body.street_no, req.body.street, req.body.city, req.body.state, req.body.post_code, req.body.country, req.body.date, req.body.start_time , req.body.fin_time], function(error, rows, fields)
    {
        //Running query
        connection.release(); // release connection
        if (error)
        {
          console.log(error);
          console.log("Could not alert");
          res.sendStatus(500);
          return;
        }

        req.pool.getConnection(function(error,connection)
        {
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }
    // get user id from session (assuming theyre logged in)
    // find where user id in the session matches w user id in the users table
    // in events time table, insert start time and end time, and the user id is the user id from session
    // when inserting the rest of the details into event table, may need to use inner join
    // get last inserted time id and insert all the event details + time id into the event table

    // userID FROM users_events INNER JOIN users WHERE users.userID = users_events.userID
          let event_query = "INSERT INTO event (eventID, eventName, street_no, street, suburb, state, post_code, country, date, userID) VALUES (?,?,?,?,?,?,?,?,?,?);";
          connection.query(query,[req.body.eventName, req.body.street_no, req.body.street, req.body.city, req.body.state, req.body.post_code, req.body.country, req.body.date, req.body.start_time , req.body.fin_time], function(error, rows, fields){
              //Running query
              connection.release(); // release connection
              if (error)
              {
                console.log(error);
                console.log("Could not alert");
                res.sendStatus(500);
                return;
              }

          });
        });
      });
    }
  )}
});

// router.post('/matchid', function(req, res, next) {
//   res.sendStatus(200);
//   // let event_id = req.body;

//   // //Connect to the database
//   // req.pool.getConnection( function(err,connection) {
//   //   if (err) {
//   //     res.sendStatus(500);
//   //     return;
//   //   }
//   //   var query = "SELECT eventID FROM event WHERE eventID = ?;";
//   //   connection.query(query, [event_id], function(err, rows, fields) {
//   //     connection.release(); // release connection
//   //     if (err) {
//   //       res.sendStatus(500);
//   //       return;
//   //     }
//   //     if (rows.length == 1) {
//   //       console.log("Id matched");
//   //       res.sendStatus(200);
//   //     }
//   //     else {
//   //       res.sendStatus(400);
//   //     }
//   //   });
//   // });
// });

router.post('/matchid', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT eventName FROM event WHERE eventName = ?;";
    connection.query(query,[req.body.event_id], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // if (rows.length == 1) {
      //   console.log("Found event");
      //   res.sendStatus(200);
      // }
      // else {
      //   res.sendStatus(401);
      // }
      res.send(rows);
    });

  });

});

module.exports = router;