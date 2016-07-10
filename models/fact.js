'use strict';

module.exports = function(sequelize, DataTypes) {
  var fact = sequelize.define('facts', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER
      , field: "user_id"
    },
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
        fact.hasMany(models.attachments, {
          onDelete: "CASCADE",
          foreignKey: 'target_id',
          constraints: false,
          scope: {
            target_type: 'facts'
          }
        });
      }
    }
  });
  return fact;
};
