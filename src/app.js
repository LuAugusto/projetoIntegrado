const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');

class App{
      constructor(){
            this.server = express();
            this.server.use(cors());
            mongoose.connect(
                  'mongodb+srv://devhouse:devhouse@devhouse.pjcxf.mongodb.net/devhouse?retryWrites=true&w=majority',
                  {
                        useNewUrlParser:true,
                        useUnifiedTopology:true,
                        useCreateIndex:true,
                  }
            );
            this.middlewares();
            this.routes();
      }
      middlewares(){
            this.server.use(express.json());
      }
      routes(){
            this.server.use(routes);
      }
}

module.exports = new App().server;