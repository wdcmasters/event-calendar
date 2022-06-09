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
router.post('/addUser', function (req, res, next) {
    //Storing info from post request

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

module.exports = router;