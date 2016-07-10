'use strict';
module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define('cards', {
    name: DataTypes.STRING,
    name_en: DataTypes.STRING,
    rarity: DataTypes.STRING,
    cover: DataTypes.STRING,
    properties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    description: DataTypes.STRING,
    occupation: DataTypes.STRING,
    card_type: DataTypes.STRING,
    mana: DataTypes.INTEGER,
    attack: DataTypes.INTEGER,
    health: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return card;
};
