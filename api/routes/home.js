var express = require('express');
var router = express.Router();
var models = require('../../models');
var factView = require('../views/fact');
var Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
  var obj = {}
  models.facts.find({order: [[Sequelize.fn('RANDOM')]], include: [{model: models.attachments}]}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      obj.current = factView.renderFact(fact);
      models.facts.find({where: {id: {$lt: fact.id}}, order: [['id', 'DESC']], include: [{model: models.attachments}]}).then(function(prev) {
        if (prev != null) {
          obj.prev = factView.renderFact(prev);
        }
        models.facts.find({where: {id: {$gt: fact.id}}, include: [{model: models.attachments}]}).then(function(next) {
          if (next != null) {
            obj.next = factView.renderFact(next);
          }
          res.json(obj);
        })
        .catch(function(error) {
          next(error);
        });
      })
      .catch(function(error) {
        next(error);
      });
    }
  })
  .catch(function(error) {
    next(error);
  });
});

module.exports = router;
