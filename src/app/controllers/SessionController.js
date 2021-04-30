const jwt = require('jsonwebtoken');
const User = require('../models/User');
const File = require('../models/File');
const Yup = require('yup');

class SessionController{
  async store(req,res){
      
      const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
      })

      if(!(await schema.isValid(req.body))){
            return res.json({erro:'Falha na validação dos dados'});
      }

      const {email,password} = req.body;
      
      const user = await User.findOne({
            where: {email},
            include:[
             {
               model:File,
               as:'avatar',
               attributes:['id','path','url']
             }
            ]
      });
                  
      if(!user){
            return res.json({error:'Usuario inválido ou senha incorreta!'});
      }

      if(!(await user.checkPassword(password))){
            return res.json({error:'Usuario não encontrado!'});
      }

      const {id,name,avatar} = user;

      // hash do token / token:'validtoken';
      const token = jwt.sign({
            id
            }, '3228e8a9e5c3726304a62fa5353e5f06', {expiresIn:'7d'});
      return res.json({
            user:{
                  id,
                  name,
                  avatar
            },
            token,
      });
      }           
}

module.exports = new SessionController();