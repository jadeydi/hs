var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var cardView = require('../views/card');
var Sequelize = require('sequelize');

router.get('/cards', function(req, res, next) {
  co(function* () {
    var card = yield models.cards.find({order: [[Sequelize.fn('RANDOM')]]});
    if (card == null) {
      res.status(404).json({})
    } else {
      var obj = {current: cardView.renderCard(card)};
      var prev = models.cards.find({where: {id: {$lt: card.id}}, order: [['id', 'DESC']]});
      var next = models.cards.find({where: {id: {$gt: card.id}}, order: [['id', 'ASC']]})
      var others = yield {prev: prev, next: next};

      if (others.prev != null) {
        obj.prev = cardView.renderCard(prev);
      }

      if (others.next != null) {
        obj.next = cardView.renderCard(next)
      }

      res.json(obj);
    }
  }).catch(function(error) {
    next(error);
  })
});

router.get('/cards/:id', function(req, res, next) {
  co(function* () {
    var card = yield models.cards.findById(req.params.id);
    if (card == null) {
      res.status(404).json({})
    } else {
      var obj = {current: cardView.renderCard(card)};
      var prev = models.cards.find({where: {id: {$lt: card.id}}, order: [['id', 'DESC']]});
      var next = models.cards.find({where: {id: {$gt: card.id}}, order: [['id', 'ASC']]})
      var others = yield {prev: prev, next: next};

      if (others.prev != null) {
        obj.prev = cardView.renderCard(prev);
      }

      if (others.next != null) {
        obj.next = cardView.renderCard(next)
      }

      res.json(obj);
    }
  }).catch(function(error) {
    next(error);
  })
});

router.get('/cards/:id/prev', function(req, res, next) {
  models.cards.findAll({where: {id: {$lt: req.params.id}}, order: [['id', 'DESC']], limit: 2}).then(function(cards) {
    res.json(cardView.renderCards(cards));
  })
  .catch(function(error) {
    next(error);
  });
});

router.get('/cards/:id/next', function(req, res, next) {
  models.cards.findAll({where: {id: {$gt: req.params.id}}, order: [['id', 'ASC']], limit: 2}).then(function(cards) {
    res.json(cardView.renderCards(cards));
  })
  .catch(function(error) {
    next(error);
  });
});

module.exports = router;
