var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventRouter = require('./routes/event');
var adminRouter = require('./routes/admin');

var app = express();

var dbConnectionPool = mysql.createPool({
  host: 'localhost',
  database: 'eventcalendar'
});

// middleware
app.use(function(req,res,next){
  req.pool = dbConnectionPool;
  next();
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Setting up server sessions */
app.use(session({
  secret: 'webmasters',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

// non-account holders get redirected to new page for first name and last name
app.get('/show_event.html/event/respond/guest', function(req, res) {
  req.session.eventID = req.query.eventID;
  res.redirect('/pop_up_guest.html');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/event', eventRouter);
app.use('/admin', adminRouter);


module.exports = app;
