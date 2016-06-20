'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      authentication_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      encrypted_password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
/*
CREATE UNIQUE INDEX ON users ((LOWER(username)));
CREATE UNIQUE INDEX ON users ((LOWER(email)));
CREATE UNIQUE INDEX ON users (authentication_token);
*/
