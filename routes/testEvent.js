var express = require('express');
var router = express.Router();

router.get('/event/respond', function(req, res, next) {

    res.sendFile("book_event.html", { root: path.resolve(_dirname, '../pages') }, function(err) {
        if(err) {
            //error handling
        }
        
    });



});




module.exports = router;