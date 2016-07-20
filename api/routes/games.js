var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var gameView = require('../views/game');
var uuid = require('node-uuid');
var qiniu = require('../../utils/qiniu');

router.get('/games/:id', function(req, res, next) {
  models.games.findById(req.params.id).then(function(game) {
    if (game == null) {
      var error = new Error()
      error.status = 404
      next(error)
    } else {
      res.json(gameView.renderGameView(game))
    }
  }).catch(function(error) {
    next(error);
  });
});

router.get('/games/:id/edit', function(req, res, next) {
  models.games.find({where: {id: req.params.id, userId: req.current_user.id}}).then(function(game) {
    if (game == null) {
      var error = new Error()
      error.status = 404
      next(error)
    } else {
      res.json(gameView.renderGameView(game))
    }
  }).catch(function(error) {
    next(error);
  });
});

router.post('/games', function(req, res, next) {
  var body = req.body;
  req.current_user.createGame(gameView.renderGame(body)).then(function(game) {
    if (body.coverData != '') {
      var key = 'games/cover/' + uuid.v4() + '.png';

      qiniu.upload(key, body.coverData, next, function() {
        game.cover = key;
        game.save().then(function(game) {
          res.json(gameView.renderGameView(game))
        }).catch(function(error) {
          next(error);
        })
      })
    } else {
      res.json(gameView.renderGameView(game))
    }
  }).catch(function(error) {
    next(error);
  })
});

router.patch('/games/:id', function(req, res, next) {
  co(function* () {
    var game = yield models.games.find({where: {id: req.params.id, userId: req.current_user.id}})
    if (game == null) {
      res.status(404).json({})
    } else {
      var body = req.body;
      game.name = body.name;
      game.description = body.description;
      game.website = body.website
      game.platforms = [].concat(body["platforms[]"])
      var game = yield game.save()
      if (body.coverData != '') {
        var key = 'games/cover/' + uuid.v4() + '.png';

        qiniu.upload(key, body.coverData, next, function() {
          game.cover = key;
          game.save().then(function(game) {
            res.json(gameView.renderGameView(game))
          }).catch(function(error) {
            next(error);
          })
        })
      } else {
        res.json(gameView.renderGameView(game))
      }
    }
  }).catch(function(error) {
    next(error);
  })
});

module.exports = router;
