var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  //Checking if all the fields are filled
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'password' in req.body) {

    //Opening connection to insert user
    req.pool.getConnection(function(error,connection) {
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      let query = "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?);"; //Inserting user
      connection.query(query,[req.body.first_name, req.body.last_name, req.body.email, req.body.password], function(error, rows, fields)
      { //Running query
        connection.release(); // release connection
        if (error) {
          console.log(error);
          console.log("Could not alert");
          res.sendStatus(500);
          return;
        }
        res.end();
      });
    });
  }
});


module.exports = router;
