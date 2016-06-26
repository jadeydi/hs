var express = require('express');
var router = express.Router();
var models = require('../../models');
var factView = require('../views/fact');

router.post('/facts', function(req, res) {
  var body = req.body;
  req.current_user.createFact({description: body.description, hero: body.hero}).then(function(fact) {
    res.json(factView.renderFact(fact));
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
        res.json(factView.renderFact(fact));
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
    var obj = {}
    if (fact == null) {
      res.status(404).json({});
    } else {
      obj.current = factView.renderFact(fact);
      models.facts.find({where: {id: {$lt: fact.id}}, order: 'id DESC'}).then(function(prev) {
        if (prev != null) {
          obj.prev = factView.renderFact(prev);
        }
        models.facts.find({where: {id: {$gt: fact.id}}}).then(function(next) {
          if (next != null) {
            obj.next = factView.renderFact(next);
          }
          res.json(obj);
        })
        .catch(function(error) {
          res.status(500).json({});
        });
      })
      .catch(function(error) {
        res.status(500).json({});
      });
    }
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

router.get('/facts/:id/prev', function(req, res) {
  models.facts.findAll({where: {id: {$lt: req.params.id}}, order: 'id DESC', limit: 2}).then(function(facts) {
    res.json(factView.renderFacts(facts));
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

router.get('/facts/:id/next', function(req, res) {
  models.facts.findAll({where: {id: {$gt: req.params.id}}, limit: 2}).then(function(facts) {
    res.json(factView.renderFacts(facts));
  })
  .catch(function(error) {
    res.status(500).json({});
  });
});

module.exports = router;
