var express = require('express');
var router = express.Router();


router.post('/event/respond', function(req, res, next) {
    if (req.body.first_name == "" || req.body.last_name == "")
    {
      console.log("Fill in the inputs");
      res.sendStatus(404);
      return;
    }
    if ('first_name' in req.body && 'last_name' in req.body) {
      //Opening connection
      req.pool.getConnection(function(error,connection) {
        if(error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }

        let query = "INSERT INTO users (first_name,last_name) VALUES (?,?);"; //Inserting guest into db
        connection.query(query,[req.body.first_name, req.body.last_name], function(error, rows, fields)
        {
          //Running query
          connection.release(); // release connection
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
            res.redirect("book_event.html");
          }

        });
      });
    }
  });



// get event details for a given event id

/*

router.get('/event/respond', function(req, res, next) {

    res.sendFile("book_event.html", { root: path.resolve(_dirname, '/event_details') }, function(err) {
        if(err) {
            //error handling
        }

    });



});

*/


module.exports = router;