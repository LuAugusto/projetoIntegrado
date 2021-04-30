const jwt = require('jsonwebtoken');
const Provider = require('../models/Provider');
const File = require('../models/File');
const Yup = require('yup');

class ProviderSessionController{
  async store(req,res){
     const schema = Yup.object().shape({
          email: Yup.string().email().required(),
          password: Yup.string().required(),
      })

      if(!(await schema.isValid(req.body))){
            return res.json({erro:'Falha na validação dos dados'});
      }

      const {email,password} = req.body;

      const provider = await Provider.findOne(
            {
             where: {email:req.body.email},
             include:[
                  { model:File,
                   as:'avatar',
                   attributes:['id','path','url']
                  }
             ]     
            }
      );
              
      if(!provider){
            return res.json({error:'Usuario inválido ou senha incorreta!'});
      }

      if(!(await provider.checkPassword(password))){
            return res.json({error:'Usuario ou senha inválidos'});
      }
              
      // hash do token / token:'validtoken';
      const token = jwt.sign({
        email:email
      }, '3228e8a9e5c3726304a62fa5353e5f06', {expiresIn:'7d'}); 

      const {endereco,name} = provider;

      return res.json({     
            provider:{
                  email,
                  endereco,
                  name,
            },
            token,
      });
  }
             
}

module.exports = new ProviderSessionController();