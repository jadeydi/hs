'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true
      }
    },
    nickname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.STRING
    },
    authenticationToken: {
      type: DataTypes.STRING,
      field: 'authentication_token'
    },
    bio: DataTypes.TEXT,
    encryptedPassword: {
      type: DataTypes.STRING,
      field: 'encrypted_password'
    },
    salt: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        user.hasMany(models.facts);
        user.hasMany(models.attachments);
      }
    },
    instanceMethods: {
      isAdmin: function() {
        return this.role == 'staff'
      },
      name: function() {
        return this.nickname || this.username
      }
    }
  });
  return user;
};
