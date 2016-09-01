var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var userView = require('../views/user');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');

const cookieName = '_cksixty_com';
const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);

router.post('/sessions', function(req, res, next) {
  var body= req.body;
  models.users.findOne({where: {$or: [{username: body.identity}, {email: body.identity}]}}).then(function(user) {
    if (user == null) {
      res.status(401).json({});
    } else if (passwordHash.verify(body.password + user.salt, user.encryptedPassword)) {
      res.cookie(cookieName, user.authenticationToken, { expires: expiration }).json(userView.renderUser(user));
    } else {
      res.status(401).json({});
    }
  }).catch(function(error) {
    next(error);
  });
});

// Todo authenticationToken should uniq
router.post('/account', function(req, res) {
  var body = req.body;
  co(function* () {
    var user = yield models.users.findOne({where: {username: body.username.toLocaleLowerCase()}})
    if (user != null) {
      res.status(422).json({errors: ['username_exist']});
      return
    }
    user = yield models.users.findOne({where: {email: body.email.toLocaleLowerCase()}})
    if (user != null) {
      res.status(422).json({errors: ['email_exist']});
      return
    }
    if (body.password.length < 6) {
      res.status(422).json({errors: ['password_length_too_short']});
      return
    }

    var salt = randomstring.generate(16);
    var token = randomstring.generate({ charset: 'hex' });
    var password = passwordHash.generate(body.password + salt);
    models.users.create({username: body.username, nickname: body.nickname, email: body.email, salt: salt, encryptedPassword: password, authenticationToken: token})
    .then(function(user) {
      res.cookie(cookieName, user.authenticationToken, { expires:  expiration }).json(userView.renderUser(user));
    }).catch(function(e) {
      var fields = e.errors.map(function(obj) {
        return obj.path
      });

      res.status(422).json({errors: fields});
    })
  }).catch(function(error) {
    next(error);
  });
});

router.put('/account', function(req, res) {
  var user = req.current_user;
  var body = req.body;

  user.username = body.username
  user.nickname = body.nickname

  if (body.password != '' && body.password.length > 5) {
    if (passwordHash.verify(body.old_password + user.salt, user.encryptedPassword)) {
      var token = randomstring.generate({ charset: 'hex' });
      user.authenticationToken = token
      user.encryptedPassword = passwordHash.generate(body.password + user.salt)
    }
  }

  user.save().then(function(user) {
    res.cookie(cookieName, user.authenticationToken, { expires:  expiration }).json(userView.renderUser(user));
  }).catch(function(error) {
    next(error)
  })
});

router.get('/account', function(req, res) {
  res.json(userView.renderUser(req.current_user));
});

module.exports = router;
