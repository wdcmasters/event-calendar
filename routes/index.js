var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'password' in req.body) {
    if (req.body.email in users) {
      console.log('user exists!');
      res.sendStatus(403);
    } else {
      users[req.body.email] = { email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name, password: req.body.password }
    }
  }
});




module.exports = router;
