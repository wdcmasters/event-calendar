var express = require('express');
var router = express.Router();

/* Index page redirects to dashboard if logged in */
router.get('/', function(req, res, next) {
  if ('user' in res.session)
  {
    res.redirect("/Dashboard.html");
    return;
  }
  res.render('index', { title: 'Express' });
});

router.get('/show_details.html', function(req, res, next) {
  console.log("SHOW DETAILS LOGGED");
  req.session.eventID = req.query.eventCode;
  res.send("/show_details.html");


});

/* Go to admin page */
router.get('/admin-dashboard.html', function(req, res, next) {
  if ('admin' in req.session)
  {
    console.log("admin is in req.session");
    res.redirect("/admin-dashboard.html");
    return;
  }
  res.sendStatus(403);
});

/*SIGN UP */
//
//
router.post('/signup', function(req, res, next) {

  //Making sure all fields are filled
  if (req.body.first_name == "" || req.body.last_name == "" || req.body.email == "" || req.body.password == "")
  {
    console.log("Fill in the inputs");
    res.sendStatus(404);
    return;
  }

  //Checking if all fields are present
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'password' in req.body) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      //Inserting user into database
      let query = "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);"; //Inserting user
      connection.query(query,[req.body.first_name, req.body.last_name, req.body.email, req.body.password], function(error, rows, fields)
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

          //NEW CONNECTION --> Getting id of account just created
          req.pool.getConnection(function(error,connection) {
            if(error)
            {
              console.log(error);
              res.sendStatus(500);
              return;
            }

            //Inserting user into database
            let query = "SELECT LAST_INSERT_ID() AS lastID FROM users;"; //Inserting user
            connection.query(query, function(error, rows, fields)
            {
              //Running query
              connection.release();
              //Error handling
              if (error)
              {
              console.log(error);
              console.log("Could not alert");
              res.sendStatus(500);
              return;
              }
              //Storing userID in session
              req.session.user = rows[0].lastID;
              console.log(rows[0].lastID);
              res.sendStatus(200);
            });
          });
      });

    });
  }
});

router.post('/login', function(req, res, next) {

  //Storing the login details
  let email = req.body.email;
  let password = req.body.password;

  //Parsing email and password (security)
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

    let query = "SELECT userID FROM users WHERE email = ? AND password = ?"; //Inserting user
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
        req.session.user = rows[0].userID;
        console.log(req.session.user);
        res.redirect("/Dashboard.html");

        return;
      }

      res.sendStatus(401);
    });
  });
});

// Logout Route
router.get('/logout', function (req,res,next) {

    if ('user' in req.session)
    {
      delete req.session.user;
    }

    if ('admin' in req.session)
    {
      delete req.session.admin;
    }

    res.redirect("/index.html");
    res.end();
});


module.exports = router;