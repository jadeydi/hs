var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// routes
var accounts = require('./api/routes/accounts');
var attachments = require('./api/routes/attachments');
var index = require('./api/routes/index');

// middleware
var auth = require('./middleware/authenticate');

// view engine setup
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'web', 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));
app.use(cookieParser("4acb7538c19ab5c897798456c3ca642c"));
app.use(express.static(path.join(__dirname, 'web/public')));

app.use(auth.currentUser);
app.use(auth.handleRouter);
app.use(auth.authenticate);

// api routes
app.use('/api', index);
app.use('/api', accounts);
app.use('/api', attachments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.info(err)
  res.status(err.status || 500).json({})
});

module.exports = app;
