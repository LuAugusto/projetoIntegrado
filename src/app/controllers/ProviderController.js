const Yup = require('yup');
const Provider = require('../models/Provider');

const File = require('../models/File');

class ProviderController{
   async store(req,res){
         
      const schema = Yup.object().shape({
            email:Yup.string().required().email(),
            name:Yup.string().required(),
            telefone:Yup.number().required(),
            password:Yup.string().required().min(6),
            telefone:Yup.string().required(),
            endereco:Yup.string().required(),
            services:Yup.string().required(),
      })

      if(!(await schema.isValid(req.body))){
            return res.json({error:'Erro na validação dos dados'});
      }
      
      const userExists = await Provider.findOne({
            where:{email:req.body.email}
      });
      
      if(userExists){
            return res.status(401).json({error:'Usuario já existe'});
      }
      
      const {name,email,telefone,endereco} = await Provider.create(req.body);
      
      return res.json({
            name,
            email,
            telefone,
            endereco,
      });
            
      }
  async update(req,res){
      const schema = Yup.object().shape({
            name:Yup.string(),
            email:Yup.string().email(),
            oldpassword:Yup.string().min(6),
            password: Yup.string().min(6).when('oldpassword', (oldpassword, field) =>
              oldpassword ? field.required() : field
            ),
            confirmPassword:Yup.string().when('password', (password,field) =>
              password ? field.required().oneOf([Yup.ref('password')]) : field
            )
          })
      
          if(!(await schema.isValid(req.body))){
            return res.status(401).json({error:'Validation fails'});
          }

      const {email,oldpassword} = req.body;
      
      const provider = await Provider.findOne({
            where:{email:req.userId}
      });
      
      if(email !== provider.email){
          const userExists = await Provider.findOne({
            where:{email}
          })

          if(userExists){
                return res.json({error:'Email já cadastrado'});
          }
      }
      
      if(oldpassword && !(await provider.checkPassword(oldpassword))){
            return res.status(401).json({error:'Senha incompatível'});
      }

      await provider.update(req.body);
      
      const {name,avatar} = await Provider.findOne({email:req.userId}, {
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
   async index(req,res){
         const providers = await Provider.findAll({
               attributes:['id','name','email','avatar_id'],
               include:[{
                     model:File,
                     as:'avatar',
                     attributes:['name','path','url']
               }]
         })
         return res.json(providers);
   }
}
module.exports = new ProviderController();