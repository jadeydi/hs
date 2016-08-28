'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-z0-9][a-z0-9_]+$/i,
        min: 3,
        max: 32
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        max: 108,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
    salt: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
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
