var express = require('express');
var router = express.Router();

// load google auth library and client id
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('395070286663-89a13j9p6bnq3ipd91072dfpjk2d61fj.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/get_name', function(req, res, next) {
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT first_name FROM users WHERE userID = ?;";
    connection.query(query,[req.session.user], function(error, rows, fields)
    {
      //Running query
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// need to merge with actual login route done by luke/ajeendra
// this also contains checking for google token
router.post('/google_login', function(req, res, next)
{
   if ('token' in req.body)
   {
    let email = null;
    let firstName = null;
    let lastName = null;

    // validate token - from google
    async function verify()
    {
      // wait until verification process is complete
      const ticket = await client.verifyIdToken(
        {
          idToken: req.body.token,
          audience: '395070286663-89a13j9p6bnq3ipd91072dfpjk2d61fj.apps.googleusercontent.com'  // Specify the CLIENT_ID of the app that accesses the backend
        });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // console.log(userid);
      email = payload['email'];
      firstName = payload['given_name'];
      lastName = payload['family_name'];
    }

    // if token verification is successful
    verify().then(function()
    {
      req.pool.getConnection(function(error, connection)
      {
          if (error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          // check if user already in database
          let query = "SELECT userID FROM users WHERE email = ?;";
          connection.query(query, [email], function(error, rows, fields)
          {
            connection.release();
            if (error)
            {
              console.log(error);
              res.sendStatus(500);
              return;
            }
            // establish authenticated session for user
            if (rows.length > 0)
            {
              console.log('success');
              req.session.gmail = true;
              req.session.user = rows[0].userID;
              // console.log("rows[0] = " + rows[0].userID);
              res.sendStatus(200);
            }
            // if user isn't in database yet, create new user record
            else
            {
              req.pool.getConnection(function(error, connection)
              {
                if (error)
                {
                  console.log(error);
                  res.sendStatus(500);
                  return;
                }
                let query = "INSERT INTO users (first_name, last_name, email) VALUES(?, ?, ?);";
                connection.query(query, [firstName, lastName, email], function(error, rows, fields)
                {
                  connection.release();
                  if (error)
                  {
                    console.log(error);
                    res.sendStatus(500);
                    return;
                  }
                  // establish session for user
                  req.pool.getConnection(function(error, connection) {
                    if (error) {
                      console.log(error);
                      res.sendStatus(500);
                      return;
                    }
                    let query = "SELECT LAST_INSERT_ID() AS userID FROM users;";
                    connection.query(query, function(error, rows, fields){
                      connection.release();
                      if (error) {
                        console.log(error);
                        res.sendStatus(500);
                        return;
                      }
                      req.session.gmail = true;
                      req.session.user = rows[0].userID;
                      res.sendStatus(200);
                    })
                  })
                });
              });
            }
          });
        });
    // if token verification unsuccessful, send 401 unauthorised
    }).catch(function()
    {
      res.sendStatus(401);
    });
  }
// if token not supplied in request body, send 400 error
  else {
    console.log('bad request');
    res.sendStatus(400);
  }
});


/*Sign out Route */
router.post('/signout', function(req, res, next) {
  if('user' in req.session){
    delete req.session.user;
  }
  else {
    res.sendStatus(401);
  }
  res.end();
});


/*DASHBOARD ROUTES */
//
//

// Getting userID from session
router.get('/getID', function(req, res, next) {

  if ('user' in req.session)
  {
    // console.log("UserID (/getID): "+req.session.user);
    res.send(""+req.session.user+""); //Had to make sure is being sent as a string, since thinks its a response code
  }
  else
  {
    res.sendStatus(401);
  }

});

// Getting events the user is in
router.post('/getEvents', function(req, res, next) {

  //Storing userID for prepared statement
  let userID = req.body.userID;
  // console.log("Received user id is "+userID);

  //Opening connection
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT event.eventID,event.eventName,event.street_no,event.street,event.suburb,event.country,event.date,event_times.start_time FROM event INNER JOIN event_times ON event.eventID = event_times.eventID INNER JOIN users_events ON users_events.eventID = event.eventID WHERE users_events.userID = ?;"; //Inserting user
    connection.query(query,[userID], function(error, rows, fields)
    {
      //Running query
      connection.release();
      if (error) {
        console.log(error);
        console.log("Could not alert");
        res.sendStatus(500);
        return;
      }
      // console.log(rows);
      res.send(rows);

    });
  });
});

/* returns whether a user has logged in with a gmail account or not - used to hide gcal api button on book_event */
router.get('/check_google_user', function(req, res, next){
  res.json(req.session.gmail);
});

/* returns whether a user is a guest or not - used for redirecting to appropriate page once availability submitted */
router.get('/check_guest', function(req, res, next){
  console.log("guest: " + req.session.guest);
  res.json(req.session.guest);
});

//  Checking that the user is an admin
router.post('/isAdmin', function(req, res, next) {

  //Storing userID for prepared statement
  let userID = req.body.userID;

  console.log("Admin route user ID: "+userID);
  //Opening connection
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT userID FROM roles WHERE userID = ?;"; //Inserting user
    connection.query(query,[userID], function(error, rows, fields)
    {
      //Running query
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      //Positive response
      if (rows.length > 0)
      {
        req.session.admin = true;
        res.sendStatus(200);
        return;
      }

      res.sendStatus(403);
    });
  });
});

/* Send account details to be displayed on user-account.html */
router.get('/get_user_details', function(req, res, next){
  //Opening connection
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT first_name, last_name, email, password FROM users WHERE userID = ?;";
    connection.query(query,[req.session.user], function(error, rows, fields)
    {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/change_name', function(req, res, next) {
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE users SET first_name = ?, last_name = ? WHERE userID = ?;"; //Inserting user
    connection.query(query,[req.body.first_name, req.body.last_name, req.session.user], function(error, rows, fields)
    {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

/* update user's email */
router.post('/change_email', function(req, res, next) {
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT password FROM users WHERE userID = ?;";
    connection.query(query,[req.session.user], function(error, rows, fields)
    {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if (rows[0].password == req.body.current_pwd) {
        req.pool.getConnection(function(error,connection) {
          if(error)
          {
            console.log(error);
            res.sendStatus(500);
            return;
          }

          let query = "UPDATE users SET email = ? WHERE userID = ?;";
          connection.query(query,[req.body.new_email, req.session.user], function(error, rows, fields)
          {
            connection.release();
            if (error) {
              console.log(error);
              res.sendStatus(500);
              return;
            }
            res.sendStatus(200);
          });
        });
      }
      else {
        console.log("passwords do not match");
        res.sendStatus(401);
      }
    });
  });
});

/* update user's password */
router.post('/change_pwd', function(req, res, next) {
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE users SET password = ? WHERE userID = ?;";
    connection.query(query,[req.body.new_pwd, req.session.user], function(error, rows, fields)
    {
      connection.release();
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
