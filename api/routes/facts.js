var express = require('express');
var router = express.Router();
var co = require('co');
var models = require('../../models');
var factView = require('../views/fact');

// TODO use transaction
router.post('/facts', function(req, res, next) {
  var body = req.body;
  req.current_user.createFact({description: body.description, tags: [].concat(body["tags[]"]), status: body.status}).then(function(fact) {
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
  co(function* () {
    var fact = yield models.facts.find({where: {id: req.params.id, userId: req.current_user.id}})
    if (fact == null) {
      res.status(404).json({});
    } else {
      var body = req.body;
      fact.description = body.description
      fact.tags = [].concat(body["tags[]"])
      fact.status = body.status
      var fact = yield fact.save()
      res.json(factView.renderFact(fact));
    }
  }).catch(function(error) {
    next(error);
  });
});

router.get('/facts/:id', function(req, res, next) {
  co(function* () {
    var fact = yield models.facts.find({where: {id: req.params.id}, include: [{model: models.attachments}]});
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
