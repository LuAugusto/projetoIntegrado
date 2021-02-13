const {Schema, model} = require('mongoose');

const PedidoSchema = new Schema({
  date:String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  service:{
    type:String,
    unique:true,
    require:true,
  },
  location:{
    type:String,
    unique:true,
    require:true,
  },
  description:{
    type:String,
    unique:true,
    require:true,
  }
  
});
module.exports = model('Pedido', PedidoSchema); 