'use strict';
module.exports = function(sequelize, DataTypes) {
  var fact = sequelize.define('facts', {
    description: DataTypes.TEXT,
    userId: { type: DataTypes.INTEGER, field: "user_id" },
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        fact.belongsTo(models.users, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return fact;
};
