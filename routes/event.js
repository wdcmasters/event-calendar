var express = require('express');
var router = express.Router();

router.post('/addevent', function(req, res, next) {

    //Storing the event details
    let eventName = req.body.eventName;
    let password = req.body.password;

    //Parsing email and password (do later)
    //
    //

    //Making sure fields are filled
    if (email == "" || password == "")
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

      let query = "SELECT email,password FROM users WHERE email = ? AND password = ?"; //Inserting user
      connection.query(query,[email, password], function(error, rows, fields)
      {
        //Running query
        connection.release(); // release connection
        if (error) {
          console.log(error);
          console.log("Could not alert");
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          console.log("login success");

          //Associating user with session
          req.session.authenticated = true;
          req.session.user = { email: email, password: password };

          console.log(req.session.user);

          //Redirecting to dashboard
          res.redirect('/Dashboard.html');
          return;
        }

        res.sendStatus(401);
      });
    });

  });

module.exports = router;