var express = require('express');
var router = express.Router();
var models = require('../../models');
var uuid = require('node-uuid');
var fs = require("fs");
var qiniu = require("qiniu");
var config = require(__dirname + '/../../config/qiniu.json');
var attachmentView = require('../views/attachment');

qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

router.post('/attachments', function(req, res, next) {
  var body = req.body;
  var base64Data = body.data.replace(/^data:image\/png;base64,/, body.data),
      key = 'attachments/' + uuid.v4() + '.png',
      fileName = __dirname + '/../../web/public/' + key;

  fs.writeFile(fileName, base64Data, 'base64', function(error) {
    if (error == null) {
      var extra = new qiniu.io.PutExtra();

      qiniu.io.putFile(uptoken(config.bucket, key), key, fileName, extra, function(error, ret) {
        if(!error) {
          fs.unlinkSync(fileName);
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
        } else {
          next(error)
        }
      });
    } else {
      next(error)
    }
  });
});

module.exports = router;
