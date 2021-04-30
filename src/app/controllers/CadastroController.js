const User = require('../models/User');
const File = require('../models/File');
const Yup = require('yup');

class CadastroController{
   async store(req,res){
      const schema = Yup.object().shape({
         email:Yup.string().required().email(),
         name:Yup.string().required(),
         telefone:Yup.number().required(),
         password:Yup.string().required().min(6),
       })

      if(!(await schema.isValid(req.body))){
            return res.json({error:'Erro na validação dos dados'});
      }

      const userExists = await User.findOne({
            where:{email:req.body.email}
      });

      if(userExists){
            return res.status(401).json({error:'Usuario já existe'});
      }

      const {id,name,email,telefone} = await User.create(req.body);

      return res.json({
            id,
            name,
            email,
            telefone,
      })
      
}
   async update(req,res){
      const schema = Yup.object().shape({
            email:Yup.string().required().email(),
            name:Yup.string().required(),
            telefone:Yup.number().required(),
            oldpassword:Yup.string().required(),
            password:Yup.string().required().min(6).when('oldpassword', (oldpassword,field) => 
                oldpassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password',(password,field) => 
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
      })

      if(!(await schema.isValid(req.body))){
            return res.json({error:'Erro na validação dos dados'});
      }

      const {email,oldpassword} = req.body;
      
      const user = await User.findOne(req.userId)

      if(email !== user.email){
          const userExists = await User.findOne({
            where:{email}
          })

          if(userExists){
                return res.json({error:'Email já cadastrado'});
          }
      }

      if(oldpassword && !(await user.checkPassword(oldpassword))){
            return res.status(401).json({error:'Senha incompatível'});
      }

      await user.update(req.body);

      const {name,avatar} = await User.findOne({email:req.userId}, {
            include:[
                  {
                  model:File,
                  as:'avatar',
                  attributes:['id','path','url']
                  }
            ]
      })

      return res.json({email,name,avatar});
   }
}
module.exports = new CadastroController();