const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

class SessionController{
      async store(req,res){
            try{  
                  const schema = Yup.object().shape({
                        email: Yup.string().email().required(),
                        password: Yup.string().required(),
                  })

                  if(!(await schema.isValid(req.body))){
                        return res.json({erro:'Falha na validação dos dados'});
                  }

                  const {email} = req.body;
                  const user = await User.findOne({email:email});
                  
                  if(!user || !bcrypt.compareSync(req.body.password, user.password)){
                        return res.json({error:'Usuario inválido ou senha incorreta!'});
                  }
                  
                  // hash do token / token:'validtoken';
                  const token = jwt.sign({
                        email:email
                      }, '3228e8a9e5c3726304a62fa5353e5f06', {expiresIn:'7d'});
                  return res.json({msg:'Autenticado com sucesso', token:token, user:user._id});

            }catch(error){
                  console.log(error);
            }
      }
                 
}

module.exports = new SessionController();