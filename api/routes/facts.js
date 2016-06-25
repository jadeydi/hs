var express = require('express');
var router = express.Router();
var models = require('../../models');

router.post('/facts', function(req, res) {
  var body = req.body;
  req.current_user.createFact({description: body.description, hero: body.hero}).then(function(fact) {
    res.json({id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at});
  })
  .catch(function(error) {
    if (error.name == 'SequelizeValidationError') {
      res.status(406).json({});
    } else {
      res.status(500).json({});
    }
  });
});

router.patch('/facts/:id', function(req, res) {
  models.facts.findOne({where: {id: req.params.id, userId: req.current_user.id}}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      var body = req.body;
      fact.description = body.description
      fact.hero = body.hero
      fact.save().then(function(fact) {
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
  })
  .catch(function(error) {
    res.status(500).json({});
  });
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

router.get('/facts/:id/prev', function(req, res) {
  models.facts.find({where: {id: {$lt: req.params.id}}}).then(function(facts) {
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

router.get('/facts/:id/next', function(req, res) {
  models.facts.find({where: {id: {$gt: req.params.id}}}).then(function(facts) {
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

module.exports = router;
