'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('facts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      hero: {
        allowNull: true,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'cascade'
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
      queryInterface.addIndex("facts", ["user_id"], {});
      queryInterface.addIndex("facts", ["hero"], {});
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('facts');
  }
};
