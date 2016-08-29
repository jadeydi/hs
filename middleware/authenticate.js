var models = require('../models');

var whiteList = [
  ["GET", "^/api/$"],
  ["POST", "^/api/sessions$"],
  ["POST", "^/api/account$"],
]

function validRoutes(req) {
  return whiteList.some(function(item) {
    return item[0] == req.method && (new RegExp(item[1])).test(req.path)
  });
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
    if (req.headers.accept == 'application/vnd.cksity.com+json; version=1') {
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
    if (validRoutes(req)) {
      next();
    } else {
      res.status(401).json({})
    }
  }
}
