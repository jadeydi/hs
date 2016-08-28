var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
  res.json({games: []})
});

module.exports = router;
