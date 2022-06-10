var express = require('express');
var router = express.Router();

/*GET USERS */
router.get('/getUsers', function(req, res, next) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
        if(error)
        {
            console.log(error);
            res.sendStatus(500);
            return;
        }

    let query = "SELECT * FROM users;"; //Select all details about users
        connection.query(query, function(error, rows, fields)
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

/*MAKE USER */
router.post('/addUser', function(req, res, next) {

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

            res.sendStatus(200);

        });
      });
    }
});

/*GET EVENTS*/
router.get('/getEvents', function(req, res, next) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
        if(error)
        {
            console.log(error);
            res.sendStatus(500);
            return;
        }

    let query = "SELECT * FROM event;"; //Select all details about users
        connection.query(query, function(error, rows, fields)
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

/*GET USERS EVENTS */
router.get('/getUserEvents', function(req, res, next) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
        if(error)
        {
            console.log(error);
            res.sendStatus(500);
            return;
        }

    let query = "SELECT * FROM users_events;"; //Select all details about users
        connection.query(query, function(error, rows, fields)
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

/*GET ROLES */
router.get('/getRoles', function(req, res, next) {

    //Opening connection
    req.pool.getConnection(function(error,connection) {
        if(error)
        {
            console.log(error);
            res.sendStatus(500);
            return;
        }

    let query = "SELECT * FROM roles;"; //Select all details about users
        connection.query(query, function(error, rows, fields)
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

/*ADD ROLES*/
router.post('/addRole', function(req, res, next) {

    //Making sure all fields are filled
    if (req.body.userID == "" || req.body.role == "")
    {
      console.log("Fill in the inputs");
      res.sendStatus(404);
      return;
    }

    //Checking if all fields are present
    if ('userID' in req.body && 'role' in req.body) {

      //Opening connection
      req.pool.getConnection(function(error,connection) {
        if(error)
        {
          console.log(error);
          res.sendStatus(500);
          return;
        }

        //Inserting user into database
        let query = "INSERT INTO roles (userID, role) VALUES (?,?);"; //Inserting user
        connection.query(query,[req.body.userID, req.body.role], function(error, rows, fields)
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

            res.sendStatus(200);

        });
      });
    }
});


module.exports = router;