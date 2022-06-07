var express = require('express');
var router = express.Router();


// get event details for a given event id
app.get('/event/:id', function(req, res, next) {
    res.send()
});


router.get('/event/respond', function(req, res, next) {

    res.sendFile("book_event.html", { root: path.resolve(_dirname, '/event_details') }, function(err) {
        if(err) {
            //error handling
        }

    });



});




module.exports = router;