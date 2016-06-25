var express = require('express');
var router = express.Router();
var models = require('../../models');
var factView = require('../views/fact');

router.get('/', function(req, res) {
  models.facts.findOne({order: 'random()'}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      res.json(factView.renderFact(fact));
    }
  })
  .catch(function(error) {
    console.info(error);
    res.status(500).json({});
  });
});

module.exports = router;
