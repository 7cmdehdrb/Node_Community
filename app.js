var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

const mongoose = require('mongoose');

mongoose.connect(
  "mongodb://localhost:27017/js_community",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.once('open', () => {
  console.log("MongoDB Connect!")
});

var dotenv = require('dotenv');
dotenv.config();

var core = require('./server/routes/index');
var users = require('./server/routes/users');
var communities = require('./server/routes/communities');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', core);
app.use('/users', users);
app.use('/communities', communities);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.set('port', process.env.PORT || process.env.PORT);
var server = app.listen(app.get('port'), function(){
  console.log(`SERVER START WITH http://localhost:${server.address().port}/`);
});