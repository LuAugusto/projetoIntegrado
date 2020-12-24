const jwt = require('jsonwebtoken');
const User = require('../models/User');
const yup = require('yup');
const bcrypt = require('bcryptjs');

class SessionController{
      async store(req,res){
            try{
                  const {email} = req.body;
                  const user = await User.findOne({email:email});
                  
                  if(!user || !bcrypt.compareSync(req.body.password, user.password)){
                        return res.json({error:'Usuario inválido ou senha incorreta!'});
                  }
                  const token = jwt.sign({
                        email:email
                  }, '3228e8a9e5c3726304a62fa5353e5f06'); // hash do token / token:'validtoken';

                  return res.json({msg:'Autenticado com sucesso', token:token});

            }catch(error){
                  console.log(error);
            }
      }

      async update(req,res){
            return res.json({ok:true});
      }
}

module.exports = new SessionController();