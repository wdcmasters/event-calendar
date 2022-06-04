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
                  req.session.user = email;
                  res.sendStatus(200);
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

module.exports = router;
