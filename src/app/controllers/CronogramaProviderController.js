//Controller para listar os agendamentos recebidos do Provedor
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const {startOfDay, endOfDay, parseISO} = require('date-fns');
const {Op} = require('sequelize');

class CronogramaProviderController{
  async index(req,res){
    
    const {date} = req.query;
    const parseDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where:{
        email:req.userId,
        canceled_at:null,
        date:{
          //Operador Op -> verificar no banco agendamentos entre inicio do dia e final
          [Op.between]: [
            startOfDay(parseDate),
            endOfDay(parseDate),
          ]
        }
      },
      include:[ 
        {
          model:User,
          as:'user',
          attributes:['name']
        }
      ],
      order:['date'],
    })
    return res.json(appointment); 
  }
}
module.exports = new CronogramaProviderController();