var express = require('express');
var router = express.Router();

// load google auth library and client id
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('395070286663-89a13j9p6bnq3ipd91072dfpjk2d61fj.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// need to merge with actual login route done by luke/ajeendra
// this also contains checking for google token
router.post('/logintest', function(req, res, next)
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
              req.session.user = rows[0];
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
                  // CHANGE CODE HERE - NEED TO SET REQ.SESSION.USER TO USER ID
                  req.pool.getConnection(function(error, connection) {
                    if (error) {
                      console.log(error);
                      res.sendStatus(500);
                      return;
                    }
                    let query = "SELECT LAST_INSERT_ID() FROM users;";
                    connection.query(query, function(error, rows, fields){
                      connection.release();
                      if (error) {
                        console.log(error);
                        res.sendStatus(500);
                        return;
                      }
                      req.session.user = rows[0];
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

router.post('/signout', function(req, res, next) {
  if('user' in req.session){
    delete req.session.user;
  }
  else {
    res.sendStatus(401);
  }
  res.end();
});

/* Retrieving the userID*/
router.get('/getID', function(req, res, next) {

  //Getting the email
  email = req.session.user.email;

  /*Getting userID with mySQL */
  req.pool.getConnection(function(error,connection) { //Opening the connection
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT userID FROM users WHERE email = ?"; //Inserting user
    connection.query(query,[email], function(error, rows, fields)
    {
      //Running query
      connection.release();
      if (error) {
        console.log(error);
        console.log("Could not alert");
        res.sendStatus(500);
        return;
      }
      res.send(rows);
    });
  });
});


/* DASHBOARD PAGE: Retrieving the event details based on a userID */
router.post('/getEvents', function(req, res, next) {

  //Storing userID for prepared statement
  let userID = req.body.userID;
  console.log("Received user id is "+userID);

  //Opening connection
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT event.eventName,event.suburb,event.country,event.date,event_times.start_time FROM event INNER JOIN event_times ON event.eventID = event_times.eventID INNER JOIN users_events ON users_events.eventID = event.eventID WHERE users_events.userID = ?"; //Inserting user
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
<<<<<<< HEAD
      res.send(rows);
=======

        res.send(rows);
>>>>>>> e793a1c57a871d89672268e505a45517f77a7648

    });
  });
});


module.exports = router;
