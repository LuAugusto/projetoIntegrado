const Empresa = require('../models/Empresa');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

class EmpresaController{
      async store(req,res){
            try{
                  const schema = Yup.object().shape({
                        email:Yup.string().required().email(),
                        cnpj:Yup.string().required(),
                        nome:Yup.string().required(),
                        endereco:Yup.string().required(),
                        telefone:Yup.number().required(),
                        password:Yup.string().required(),
                  })
                  
                  const {email,nome,endereco,telefone,cnpj} = req.body;
                  const password = bcrypt.hashSync(req.body.password,10);

                  
                  if(!(await schema.isValid(req.body))){
                        return res.json({error:'Erro na validação dos dados'});
                  }
                  

                  const empresa = await Empresa.findOne({cnpj:cnpj});
                  if(empresa){
                        return res.status(401).json({error:'Usuario já existe'});
                  }

                  const newEmpresa = await Empresa.create({
                        email,
                        nome,
                        cnpj,
                        endereco,
                        telefone,
                        password,
                  })

                  return res.json(newEmpresa);
            }catch(error){
                  console.log(error);
            }
      }
}
module.exports = new EmpresaController();