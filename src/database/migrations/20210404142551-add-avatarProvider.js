'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return queryInterface.addColumn('providers','avatar_id', {
      type:Sequelize.INTEGER,
      references: {model:'files',key:'id'},
      onUpdate:'CASCADE',
      onDelete:'SET NULL',
      allowNull:true
    });
    
  },

  down: async (queryInterface) => {
    
    await queryInterface.removeColumn('providers','avatar_id');
     
  }
};
