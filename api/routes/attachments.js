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

router.post('/attachments', function(req, res) {
  var body = req.body;
  var base64Data = body.data.replace(/^data:image\/png;base64,/, body.data),
      key = 'attachments/' + uuid.v4() + '.png',
      fileName = __dirname + '/../../public/' + key;

  fs.writeFile(fileName, base64Data, 'base64', function(err) {
    if (err == null) {
      var extra = new qiniu.io.PutExtra();

      qiniu.io.putFile(uptoken(config.bucket, key), key, fileName, extra, function(err, ret) {
        if(!err) {
          fs.unlinkSync(fileName);
          req.current_user.createAttachment({path: key}).then(function(attachment) {
            res.json(attachmentView.renderAttachment(attachment));
          })
          .catch(function(error) {
            res.status(500).json({});
          });
        } else {
          res.status(500).json({err: err});
        }
      });
    } else {
      res.status(500).json({err: err});
    }
  });
});

module.exports = router;
