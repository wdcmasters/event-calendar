var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.get('/event/:id', (req, res) => {
  eventID = Number(req.params.id);
  req.pool.getConnection(function(error,connection) {
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let query="SELECT eventName WHERE eventID = ?;";
    connection.query(query,[eventID], function(error, rows, fields){


    })
  })

});


module.exports = app;
