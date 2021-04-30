const {Sequelize} = require('sequelize');
const mongoose = require('mongoose');

const User = require('../app/models/User');
const Provider = require('../app/models/Provider');
const File = require('../app/models/File');
const Appointment = require('../app/models/Appointment');

const databaseConfig =  require('../config/database');

const models = [User,File,Provider,Appointment];

class Database{
  constructor(){
    this.init();
    this.mongo();
  }
  init(){
    this.connection = new Sequelize(databaseConfig);

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }
  
  //Conexão banco mongodb
  mongo(){
    this.mongoConnection = mongoose.connect("mongodb://localhost:27017/apiprojeto", {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  }
}
module.exports = new Database();