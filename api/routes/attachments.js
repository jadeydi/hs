var express = require('express');
var router = express.Router();
var models = require('../../models');
var uuid = require('node-uuid');
var qiniu = require("../../utils/qiniu");
var attachmentView = require('../views/attachment');

router.post('/attachments', function(req, res, next) {
  var body = req.body,
      key = 'attachments/' + uuid.v4() + '.png';

  qiniu.upload(key, body.data, next, function() {
    var data = {path: key};
    if (body.target_id != null) {
      data.targetType = body.target_type;
      data.targetId = body.target_id;
    }
    req.current_user.createAttachment(data).then(function(attachment) {
      res.json(attachmentView.renderAttachment(attachment));
    })
    .catch(function(error) {
      next(error)
    });
  });
});

module.exports = router;
