const Yup = require('yup');
const Pedido = require('../models/Pedido');
const User = require('../models/User');

class PedidoController{

  async index(req,res){

    const {id}  = req.headers;

    const pedidos = await Pedido.find({user:id}).populate('user','email');

    return res.json({pedidos});
  }

  async store(req,res){

    const schema = Yup.object().shape({
      date:Yup.string().required(),
      service:Yup.string().required(),
      location:Yup.string().required(),
      description:Yup.string().required(),
    })

    if(!(await schema.isValid(req.body))){
      return res.json({error:'Falha na validação dos dados'});
    }
    
    const {id} = req.headers;
    const {date,service,location,description} = req.body;

    const user = await User.findById(id);

    const newPedido = await Pedido.create({
      date,
      user,
      service,
      location,
      description,
    });

    await newPedido.populate('user').execPopulate();

    return res.json(newPedido);
    

  }
}

module.exports = new PedidoController();