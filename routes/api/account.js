var express = require('express');
var router = express.Router();
var models = require('../../models');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');

router.post('/session', function(req, res) {
  var body= req.body;
  models.users.findOne({where: {$or: [{username: body.identity}, {email: body.identity}]}}).then(function(user) {
    if (user == null) {
      res.status(401).json({});
    } else if (passwordHash.verify(body.password + user.salt, user.encryptedPassword)) {
      res.cookie('_cksixty_com', user.authenticationToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }).json({id: user.id, username: user.username});
    } else {
      res.status(401).json({});
    }
  }).catch(function(error) {
    res.status(500).json({});
  });
});

router.post('/account', function(req, res) {
  var body = req.body;
  var salt = randomstring.generate(16);
  var token = randomstring.generate({ charset: 'hex' });
  var password = passwordHash.generate(body.password + salt);
  models.users.create({username: body.username, email: body.email, salt: salt, encryptedPassword: password, authenticationToken: token})
  .then(function(user) {
    res.cookie('_cksixty_com', user.authenticationToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }).json({username: user.username})
  })
  .catch(function(error) {
    res.status(500).json({});
  })
});

module.exports = router;
