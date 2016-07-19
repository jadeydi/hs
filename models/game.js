'use strict';
module.exports = function(sequelize, DataTypes) {
  var game = sequelize.define('games', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      },
    },
    cover: {
      type: DataTypes.STRING,
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id"
    }
  },
  {
    underscored: true,
    classMethods: {
      associate: function(models) {
        game.belongsTo(models.users, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return game;
};
