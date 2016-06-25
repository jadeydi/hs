var express = require('express');
var router = express.Router();
var models = require('../../models');

router.get('/', function(req, res) {
  models.facts.findOne({order: 'random()'}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      res.json({id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at})
    }
  })
  .catch(function(error) {
    console.info(error);
    res.status(500).json({});
  });
});

module.exports = router;
