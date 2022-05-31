var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body) {
    
  }
});




module.exports = router;
