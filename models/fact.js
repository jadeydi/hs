'use strict';
module.exports = function(sequelize, DataTypes) {
  var fact = sequelize.define('facts', {
    description: DataTypes.TEXT,
    userId: { type: DataTypes.INTEGER, field: "user_id" },
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return fact;
};
