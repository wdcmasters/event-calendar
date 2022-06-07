var express = require('express');
var router = express.Router();



router.get('/event_id', function(req, res, next) {
    
});


router.get('/event/respond', function(req, res, next) {

    res.sendFile("book_event.html", { root: path.resolve(_dirname, '/event_id') }, function(err) {
        if(err) {
            //error handling
        }

    });



});




module.exports = router;