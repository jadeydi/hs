'use strict';
module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define('cards', {
    name: DataTypes.STRING,
    nameEn: {
      type: DataTypes.STRING,
      field: "name_en"
    },
    rarity: DataTypes.STRING,
    cover: DataTypes.STRING,
    properties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    description: DataTypes.STRING,
    occupation: DataTypes.STRING,
    cardType: {
      type: DataTypes.STRING,
      field: "card_type"
    },
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
