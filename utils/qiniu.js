var fs = require("fs");
var uuid = require('node-uuid');
var qiniu = require("qiniu");
var config = require(__dirname + '/../config/qiniu.json');

qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

module.exports = {
  upload: function(key, data, next, callback) {
    var base64Data = data.replace(/^data:image\/png;base64,/, data),
    fileName = '/tmp/' + uuid.v4();

    fs.writeFile(fileName, base64Data, 'base64', function(error) {
      if (error == null) {
        var extra = new qiniu.io.PutExtra();

        qiniu.io.putFile(uptoken(config.bucket, key), key, fileName, extra, function(error, ret) {
          if (!error) {
            fs.unlinkSync(fileName);
            callback();
          } else {
            next(error)
          }
        });
      } else {
        next(error)
      }
    });
  }
}
