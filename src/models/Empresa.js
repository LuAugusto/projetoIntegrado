const {Schema,model} = require('mongoose');

const EmpresaSchema = new Schema({
      email:{
            type:String,
            unique:true,
            require:true
      },
      cnpj:{
            type:String,
            unique:true,
            require:true
      },
      nome:{
            type:String,
            require:true
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
      },
})

module.exports = model('Empresa',EmpresaSchema);