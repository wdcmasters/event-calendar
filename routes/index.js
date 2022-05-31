var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  //Checking if all the fields are filled
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'password' in req.body) {


    //Checking if email is in the database


    });

    if (req.body.email in users) { //Query for this
      console.log('user exists!');
      res.sendStatus(403);
    } else {
      
      //Opening connection to insert user
      req.pool.getConnection(function(error,connection){
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }
        let query = "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);"; //Inserting user
        connection.query(query,[req.body.first_name, req.body.last_name, req.body.email, req.body.password], function(error, rows, fields) { //Running query
          connection.release(); // release connection
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          res.end();
        });
      res.sendStatus(200);
    }


  } else {
    console.log("Bad Request");
    res.sendStatus(400);
  }
});




module.exports = router;
