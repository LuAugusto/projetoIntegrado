const jwt = require('jsonwebtoken');
const Empresa = require('../models/Empresa');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

class EsessionController{
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
              const empresa = await Empresa.findOne({email:email});
              
              if(!empresa || !bcrypt.compareSync(req.body.password, empresa.password)){
                    return res.json({error:'Usuario inválido ou senha incorreta!'});
              }
              
              // hash do token / token:'validtoken';
              const token = jwt.sign({
                email:email
              }, '3228e8a9e5c3726304a62fa5353e5f06', {expiresIn:'7d'}); 

              return res.json({msg:'Autenticado com sucesso', token:token});

        }catch(error){
              console.log(error);
        }
  }
             
}

module.exports = new EsessionController();