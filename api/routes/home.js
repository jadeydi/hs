var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var gameView = require('../views/game');
var Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
  models.games.findAll({order: [['id', 'DESC']]}).then(function(games) {
    res.json({games: gameView.renderGamesView(games)});
  }).catch(function(error) {
    next(error);
  })
});

module.exports = router;
