var models = require('../models');

var whiteList = [
  ["GET", "^/api/$"],
  ["POST", "^/api/session$"],
  ["POST", "^/api/account$"],
  ["GET", "^/api/facts/[0-9]{1,24}$"],
  ["GET", "^/api/facts/[0-9]{1,24}/prev$"],
  ["GET", "^/api/facts/[0-9]{1,24}/next$"],
  ["GET", "^/api/cards/[0-9]{1,24}$"],
  ["GET", "^/api/cards/[0-9]{1,24}/prev$"],
  ["GET", "^/api/cards/[0-9]{1,24}/next$"],
  ["GET", "^/api/games/[0-9]{1,24}$"],
]

var adminList = [
  ["GET", "^/facts/new$"],
  ["GET", "^/facts/[0-9]{1,24}/edit$"],
  ["GET", "^/games/new$"],
  ["GET", "^/games/[0-9]{1,24}/edit$"],
  ["POST", "^/api/facts$"],
  ["PATCH", "^/api/facts/[0-9]{1,24}"],
  ["POST", "^/api/games"],
  ["PATCH", "^/api/games/[0-9]{1,24}"],
]

function valid(req) {
  return whiteList.some(function(item) {
    return item[0] == req.method && (new RegExp(item[1])).test(req.path)
  });
}

function validAdmin(req) {
  var match = adminList.some(function(item) {
    return item[0] == req.method && (new RegExp(item[1])).test(req.path)
  });
  var user = req.current_user
  return (user != null && user.isAdmin()) || !match
}

module.exports = {
  currentUser: function(req, res, next) {
    token = req.cookies._cksixty_com
    if(token != undefined) {
      models.users.findOne({where: {authenticationToken: token}}).then(function(user) {
        req.current_user = user;
        next();
      }).catch(function(error) {
        next(error);
      });
    } else {
      next();
    }
  },

  handleRouter: function(req, res, next) {
    if (req.headers.accept == 'application/vnd.cksity.com+json') {
      next();
    } else {
      if (req.method == "GET" && validAdmin(req)) {
        res.render('index');
      } else {
        res.redirect("/")
      }
    }
  },

  authenticate: function(req, res, next) {
    if (validAdmin(req) || valid(req)) {
      next();
    } else {
      res.status(401).json({})
    }
  }
}
