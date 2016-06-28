'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      target_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      target_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      path: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => {
      queryInterface.addIndex("attachments", ["user_id"], {});
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('attachments');
  }
};

/*
CREATE INDEX ON attachments (target_type, target_id) WHERE (target_type <> NULL AND target_id <> NULL);
*/
