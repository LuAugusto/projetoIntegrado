const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
      email:{
            type:String,
            unique:true,
            require:true,
      },
      nome:{
            type:String,
            require:true,
      },
      endereco:{
            type:String,
            require:true,
      },
      telefone:{
            type:Number,
            require:true,
      },
      password:{
            type:String,
            require:true
      }
      },
);

module.exports = model('User',UserSchema);

/*
CarSchema.virtual('thumbnail_url').get(function(){
      return `http://localhost:3333/files/${this.thumbnail}`;
})

*/