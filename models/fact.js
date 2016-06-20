'use strict';
module.exports = function(sequelize, DataTypes) {
  var fact = sequelize.define('fact', {
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return fact;
};
