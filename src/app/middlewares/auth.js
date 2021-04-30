const jwt = require('jsonwebtoken');
const {promisify} = require('util');

module.exports = async(req,res,next) => {
      const authHeader = req.headers.authorization;
            
      if(!authHeader){
            res.status(400).json({error:'Esse token não existe'});
      }

      const [, token] = authHeader.split(' ');

      try{
            const decoded = await promisify( jwt.verify)(token,'3228e8a9e5c3726304a62fa5353e5f06');
                  
            req.userId = decoded.email;
            
            return next();

      }catch(error){
            res.status(400).json({error:'Esse token não existe'});
      }  
}