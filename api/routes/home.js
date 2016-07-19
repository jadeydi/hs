var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var factView = require('../views/fact');
var Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
  co(function* () {
    var fact = yield models.facts.find({order: [[Sequelize.fn('RANDOM')]], include: [{model: models.attachments}]});
    if (fact == null) {
      var error = new Error('');
      error.status = 404;
      yield Promise.reject(error);
    } else {
      var obj = {current: factView.renderFact(fact)};

      var prev = models.facts.find({where: {id: {$lt: fact.id}}, order: [['id', 'DESC']], include: [{model: models.attachments}]});
      var next = models.facts.find({where: {id: {$gt: fact.id}}, order: [['id', 'ASC']], include: [{model: models.attachments}]});
      var other = yield {prev: prev, next: next}

      if (other.prev != null) {
        obj.prev = factView.renderFact(prev);
      }

      if (other.next != null) {
        obj.next = factView.renderFact(next);
      }

      res.json(obj);
    }
  }).catch(function(error) {
    next(error);
  })
});

module.exports = router;
