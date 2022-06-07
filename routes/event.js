var express = require('express');
var router = express.Router();

router.post('/logout', function (req,res,next) {

    if (user in req.session)
    {
      delete req.session.user;
    }

    res.redirect("/index.html");
    res.end();
});

module.exports = router;