'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    authenticationToken: {type: DataTypes.STRING, field: "authentication_token"},
    bio: DataTypes.TEXT,
    encryptedPassword: {type: DataTypes.STRING, field: "encrypted_password"},
    salt: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        user.hasMany(models.facts);
        user.hasMany(models.attachments);
      }
    }
  });
  return user;
};
