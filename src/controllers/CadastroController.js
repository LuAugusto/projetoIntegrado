const User = require('../models/User');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

class CadastroController{
      async store(req,res){
            try{
                  const schema = Yup.object().shape({
                        email:Yup.string().required().email(),
                        cpf:Yup.string().required(),
                        nome:Yup.string().required(),
                        endereco:Yup.string().required(),
                        telefone:Yup.number().required(),
                        password:Yup.string().required(),
                  })
                  
                  const {email,nome,endereco,telefone,cpf} = req.body;
                  const password = bcrypt.hashSync(req.body.password,10);

                  
                  if(!(await schema.isValid(req.body))){
                        return res.json({error:'Erro na validação dos dados'});
                  }
                  

                  const user = await User.findOne({email:email});
                  if(user){
                        return res.status(401).json({error:'Usuario já existe'});
                  }

                  const newUser = await User.create({
                        email,
                        nome,
                        cpf,
                        endereco,
                        telefone,
                        password,
                  })

                  return res.json(newUser);
            }catch(error){
                  console.log(error);
            }
      }
}

module.exports = new CadastroController();