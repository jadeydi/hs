'use strict';
module.exports = function(sequelize, DataTypes) {
  var attachment = sequelize.define('attachments', {
    targetType: {
      type: DataTypes.STRING,
      field: "target_type"
    },
    targetId: {
      type: DataTypes.INTEGER,
      field: "target_id"
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id"
    },
    path: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        attachment.belongsTo(models.users, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return attachment;
};
