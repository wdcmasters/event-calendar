var express = require('express');
var router = express.Router();

router.post('/addevent', function(req, res, next) {

    //Storing the event details
    let eventName = req.body.eventName;
    let street_no = req.body.street_no;
    let street = req.body.street;
    let city = req.body.city;
    let state = req.body.state;
    let post_code = req.body.post_code;
    let country = req.body.country;
    let date = req.body.date;
    let start_time = req.body.start_time;
    let fin_time = req.body.fin_time;

    // console.log(req.body.eventName);
    // res.end();
    //Parsing  (do later)
    //
    //

    //Making sure all fields are filled
    if (req.body.eventName == "" || req.body.street_no == ""req.body.street == "" || req.body.city == ""req.body.state == "" || req.body.post_code == ""req.body.country == "" || req.body.date == ""req.body.start_time == "" || req.body.fin_time == "")
    {
      console.log("Fill in the inputs");
      res.sendStatus(404);
      return;
    }

    //Opening connection to check logins
    req.pool.getConnection(function(error,connection) {
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      let query = "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);"; //Inserting user
      connection.query(query,[req.body.first_name, req.body.last_name, req.body.email, req.body.password], function(error, rows, fields)
      {
        //Running query
        connection.release(); // release connection
        if (error) {
          console.log(error);
          console.log("Could not alert");
          res.sendStatus(500);
          return;
          //Associating session with user and redirecting them to dashboard
          res.session.authenticated = true;
          res.session.user = { email: req.body.email, password: req.body.password };
          res.redirect("Dashboard.html");
          }
          res.end();
        });
      });
    }
  });

module.exports = router;