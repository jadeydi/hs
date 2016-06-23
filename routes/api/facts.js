var express = require('express');
var router = express.Router();
var models = require('../../models');

router.post('/facts', function(req, res) {
  if (req.current_user == undefined) {
    res.status(401).json({});
  } else {
    var body = req.body;
    req.current_user.createFact({description: body.description, hero: body.hero, userId: req.current_user.id}).then(function(fact) {
      res.json({id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at});
    })
    .catch(function(error) {
      if (error.name == 'SequelizeValidationError') {
        res.status(406).json({});
      } else {
        res.status(500).json({});
      }
    });
  }
});

router.get('/facts/:id', function(req, res) {
  models.facts.findById(req.params.id).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      res.json({id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at})
    }
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

module.exports = router;
