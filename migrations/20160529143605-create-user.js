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
      nickname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'fellow'
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatar_url: {
        type: Sequelize.STRING,
        defaultValue: ''
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
ALTER TABLE users ADD CHECK (username ~* '^[a-z0-9][a-z0-9_]{3,31}$');
CREATE UNIQUE INDEX ON users ((LOWER(email)));
CREATE UNIQUE INDEX ON users (authentication_token);
*/
