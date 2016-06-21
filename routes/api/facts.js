var express = require('express');
var router = express.Router();
var models = require('../../models');

router.post('/facts', function(req, res) {
  if (req.current_user == undefined) {
    res.status(401).json({});
  } else {
    var body = req.body;
    models.facts.create({description: body.description, userId: req.current_user.id}).then(function(fact) {
      res.json({id: fact.id, description: fact.description, user_id: req.current_user.id});
    })
    .catch(function(error) {
      res.status(500).json({});
    });
  }
});

module.exports = router;
