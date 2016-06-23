'use strict';

var variables = require(__dirname + '/../config/variables.json');

module.exports = function(sequelize, DataTypes) {
  var fact = sequelize.define('facts', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hero: {
      type: DataTypes.STRING,
      validate: {
        isIn: [variables.heroes],
      },
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER
      , field: "user_id"
    },
  }, {
    underscored: true
    , classMethods: {
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
