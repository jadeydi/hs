var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models');

var account = require('./api/routes/account');
var attachments = require('./api/routes/attachments');
var facts = require('./api/routes/facts');
var home = require('./api/routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));
app.use(cookieParser("4acb7538c19ab5c897798456c3ca642c"));
app.use(express.static(path.join(__dirname, 'web/public')));

app.use(function(req, res, next) {
  if (req.headers.accept == 'application/vnd.cksity.com+json') {
    token = req.cookies._cksixty_com
    if(token != undefined) {
      models.users.findOne({where: {authenticationToken: token}}).then(function(user) {
        req.current_user = user;
        next();
      }).catch(function(error) {
        res.status(500).json({});
      })
    } else {
      next();
    }
  } else {
    if (req.method == "GET") {
      res.render('index', { title: 'Express' });
    } else {
      res.redirect("/")
    }
  }
});

var whiteList = [
  ["GET", "^/api/$"],
  ["POST", "^/api/session$"],
  ["POST", "^/api/account$"],
  ["GET", "^/api/facts/[0-9]{1,24}$"],
  ["GET", "^/api/facts/[0-9]{1,24}/prev$"],
  ["GET", "^/api/facts/[0-9]{1,24}/next$"],
]

function authenticate(req) {
  return whiteList.some(function(item) {
    return item[0] == req.method && (new RegExp(item[1])).test(req.path)
  });
}

app.use(function(req, res, next) {
  if (req.current_user != undefined || authenticate(req)) {
    next();
  } else {
    res.status(401).json({})
  }
});

// api routes
app.use('/api', home);
app.use('/api', account);
app.use('/api', facts);
app.use('/api', attachments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.info(err)
    res.status(err.status || 500).json({})
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({})
});

module.exports = app;
