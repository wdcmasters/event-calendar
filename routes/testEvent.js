var express = require('express');
var router = express.Router();

router.get('/event/respond', function(req, res, next) {

    res.sendFile("book_event.html"



});




module.exports = router;