'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('providers', { 
      id:{
        type:Sequelize.INTEGER ,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
      },
      name:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      password_hash:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      telefone:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      endereco:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      services:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      created_at:{
        type:Sequelize.DATE,
        allowNull:false,
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:false,
      }
      });
    
  },

  down: async (queryInterface) => {
   
    await queryInterface.dropTable('providers');
     
  }
};
