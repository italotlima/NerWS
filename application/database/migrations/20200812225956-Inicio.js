'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('sistema_sessao', {
      id_sistema_sessao: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      token: {type: Sequelize.CHAR(50), allowNull: false},
      data_expiracao: {type: Sequelize.DATE, allowNull: false},
      dados: {type: Sequelize.JSON, allowNull: false}
    });
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sistema_sessao');
  }
};
