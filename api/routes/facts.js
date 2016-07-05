var express = require('express');
var router = express.Router();
var models = require('../../models');
var factView = require('../views/fact');

// TODO use transaction
router.post('/facts', function(req, res, next) {
  var body = req.body;
  req.current_user.createFact({description: body.description, tags: body.tags, status: body.status}).then(function(fact) {
    models.attachments.update({targetId: fact.id, targetType: 'facts'}, {where: {id: {$in: [].concat(body['attachment_ids[]'])}, userId: req.current_user.id}}).then(function() {
      res.json(factView.renderFact(fact));
    })
    .catch(function(error) {
      next(error);
    })
  })
  .catch(function(error) {
    if (error.name == 'SequelizeValidationError') {
      res.status(406).json({});
    } else {
      next(error);
    }
  });
});

router.patch('/facts/:id', function(req, res, next) {
  models.facts.findOne({where: {id: req.params.id, userId: req.current_user.id}}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      var body = req.body;
      fact.description = body.description
      fact.tags = body.tags
      fact.status = body.status
      fact.save().then(function(fact) {
        res.json(factView.renderFact(fact));
      })
      .catch(function(error) {
        if (error.name == 'SequelizeValidationError') {
          res.status(406).json({});
        } else {
          next(error);
        }
      });
    }
  })
  .catch(function(error) {
    next(error);
  });
});

router.get('/facts/:id', function(req, res, next) {
  models.facts.find({where: {id: req.params.id}, include: [{model: models.attachments}]}).then(function(fact) {
    var obj = {}
    if (fact == null) {
      res.status(404).json({});
    } else {
      obj.current = factView.renderFact(fact);
      models.facts.find({where: {id: {$lt: fact.id}}, order: [['id', 'DESC']], include: [{model: models.attachments}]}).then(function(prev) {
        if (prev != null) {
          obj.prev = factView.renderFact(prev);
        }
        models.facts.find({where: {id: {$gt: fact.id}}, order: [['id', 'ASC']], include: [{model: models.attachments}]}).then(function(next) {
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

router.get('/facts/:id/edit', function(req, res) {
  models.facts.find({where: {id: req.params.id}, include: [{model: models.attachments}]}).then(function(fact) {
    if (fact == null) {
      res.status(404).json({});
    } else {
      res.json(factView.renderFact(fact));
    }
  })
  .catch(function(error) {
    next(error);
  });
});

router.get('/facts/:id/prev', function(req, res) {
  models.facts.findAll({where: {id: {$lt: req.params.id}}, order: [['id', 'DESC']], limit: 2, include: [{model: models.attachments}]}).then(function(facts) {
    res.json(factView.renderFacts(facts));
  })
  .catch(function(error) {
    next(error);
  });
});

router.get('/facts/:id/next', function(req, res) {
  models.facts.findAll({where: {id: {$gt: req.params.id}}, order: [['id', 'ASC']], limit: 2, include: [{model: models.attachments}]}).then(function(facts) {
    res.json(factView.renderFacts(facts));
  })
  .catch(function(error) {
    next(error);
  });
});

module.exports = router;
