var models = require('../models');

var whiteList = [
  ["GET", "^/api/$"],
  ["POST", "^/api/session$"],
  ["POST", "^/api/account$"],
  ["GET", "^/api/facts/[0-9]{1,24}$"],
  ["GET", "^/api/facts/[0-9]{1,24}/prev$"],
  ["GET", "^/api/facts/[0-9]{1,24}/next$"],
]

function valid(req) {
  return whiteList.some(function(item) {
    return item[0] == req.method && (new RegExp(item[1])).test(req.path)
  });
}

module.exports = {
  handleRouter: function(req, res, next) {
    if (req.headers.accept == 'application/vnd.cksity.com+json') {
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
    } else {
      if (req.method == "GET") {
        res.render('index');
      } else {
        res.redirect("/")
      }
    }
  },

  authenticate: function(req, res, next) {
    if (req.current_user != undefined || valid(req)) {
      next();
    } else {
      res.status(401).json({})
    }
  }
}
