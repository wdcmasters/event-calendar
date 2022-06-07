var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {

  //Making sure all fields are filled
  if (req.body.first_name == "" || req.body.last_name == "" || req.body.email == "" || req.body.password == "")
  {
    console.log("Fill in the inputs");
    res.sendStatus(404);
    return; 
  }

  //Checking if all the fields are filled
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'password' in req.body) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      //Checking if email is already in database
      // let query = "SELECT userID FROM users WHERE email = ?;";
      // connection.query(query, [req.body.email], function(error, rows, fields)
      // {
      //   if (error)
      //   {
      //     console.log(error);
      //     res.sendStatus(500);
      //     return;
      //   }
      //   //If something actually does come back,
      //   if (rows.length > 0)
      //   {
      //     console.log("User already exists");
      //     res.sendStatus(409);
      //     return;
      //   }
      // });

      //Inserting user into database
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

router.post('/login', function(req, res, next) {

  //Storing the login details
  let email = req.body.email;
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

router.get('/logout', function (req,res,next) {

    if (user in req.session)
    {
      delete req.session.user;
    }

    res.redirect("/index.html");
    res.end();
});

module.exports = router;