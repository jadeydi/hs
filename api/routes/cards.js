var express = require('express');
var router = express.Router();
var models = require('../../models');
var cardView = require('../views/card');
var Sequelize = require('sequelize');

router.get('/cards', function(req, res, next) {
  models.cards.find({order: [[Sequelize.fn('RANDOM')]]}).then(function(card) {
    if (card == null) {
      var error = new Error()
      error.status = 404
      next(error)
    } else {
      obj = {current: cardView.renderCard(card)};
      models.cards.find({where: {id: {$lt: card.id}}, order: [['id', 'DESC']]}).then(function(prev) {
        if (prev != null) {
          obj.prev = cardView.renderCard(prev);
        }
        models.cards.find({where: {id: {$gt: card.id}}, order: [['id', 'ASC']]}).then(function(next) {
          obj.next = cardView.renderCard(next)
          res.json(obj)
        }).catch(function(error) {
          next(error);
        })
      }).catch(function(error) {
        next(error);
      });
    }
  }).catch(function(error) {
    next(error);
  });
});

router.get('/cards/:id', function(req, res, next) {
  models.cards.findById(req.params.id).then(function(card) {
    if (card == null) {
      var error = new Error()
      error.status = 404
      next(error)
    } else {
      obj = {current: cardView.renderCard(card)};
      models.cards.find({where: {id: {$lt: card.id}}, order: [['id', 'DESC']]}).then(function(prev) {
        if (prev != null) {
          obj.prev = cardView.renderCard(prev);
        }
        models.cards.find({where: {id: {$gt: card.id}}, order: [['id', 'ASC']]}).then(function(next) {
          obj.next = cardView.renderCard(next)
          res.json(obj)
        }).catch(function(error) {
          next(error);
        })
      }).catch(function(error) {
        next(error);
      });
    }
  }).catch(function(error) {
    next(error);
  });
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
