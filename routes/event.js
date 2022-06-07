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

    console.log(req.body.eventName);
    res.end();
    //Parsing  (do later)
    //
    //

    //Making sure fields are filled
    // if (email == "" || password == "")
    // {
    //   console.log("Fill in the inputs");
    //   res.sendStatus(404);
    //   return;
    // }

    //Opening connection to check logins
    // req.pool.getConnection(function(error,connection) {
    //   if(error)
    //   {
    //     console.log(error);
    //     res.sendStatus(500);
    //     return;
    //   }

    //   let query = "SELECT email,password FROM users WHERE email = ? AND password = ?"; //Inserting user
    //   connection.query(query,[email, password], function(error, rows, fields)
    //   {
    //     //Running query
    //     connection.release(); // release connection
    //     if (error) {
    //       console.log(error);
    //       console.log("Could not alert");
    //       res.sendStatus(500);
    //       return;
    //     }

    //     if (rows.length > 0) {
    //       console.log("login success");

    //       //Associating user with session
    //       req.session.authenticated = true;
    //       req.session.user = { email: email, password: password };

    //       console.log(req.session.user);

    //       //Redirecting to dashboard
    //       res.redirect('/Dashboard.html');
    //       return;
    //     }

    //     res.sendStatus(401);
    //   });
    // });

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