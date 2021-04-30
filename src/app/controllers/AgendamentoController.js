const Appointment = require('../models/Appointment');
const User = require('../models/User');
const File = require('../models/File');
const Provider = require('../models/Provider');
const Notification = require('../schemas/Notification');
const pt = require('date-fns/locale/pt');
const Mail = require('../../lib/Mail');

const Yup = require('yup');
const {startOfHour,parseISO,isBefore,format,subHours} = require('date-fns');

//const Queue = require('../../lib/Queue');


class AppointmentController{
  async index(req,res){

    const isUser = await User.findOne(req.userId)

    const {page = 1} = req.query;

    const agendamentos = await Appointment.findAll({
      where: {user_id: isUser.id, canceled_at:null},
      order:['date'],
      attributes:['id','date','past','cancelable'],
      limit:20,
      offset:(page - 1) * 20,
      include:[
        {
          model:Provider,
          as:'providers',
          attributes:['id','name'],
          include: [
            {
              model:File,
              as:'avatar',
              attributes:['url','path','id'],
            }
          ]
        }
      ]
    });

    return res.json(agendamentos);
  }

  async store(req,res){

    const schema = Yup.object().shape({
      provider_id:Yup.number().required(),
      date:Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error:'Erro na validação dos dados'});
    }

    const {provider_id,date} = req.body;

    const isProvider = await Provider.findOne({
      where:{id:provider_id}
    });

    const isUser = await User.findOne(req.userId)

    if(!isProvider){
      return res.status(401).json({error:'Provedor não existe'});
    }

    if(isProvider.email === req.userId){
      return res.status(401).json({error:'Não pode marcar horario com você mesmo'});
    }

    //Utilizando startOfHour -> pega o inicio da hora, parseISO converte data
    const hourStart = startOfHour(parseISO(date));

    //Verificando se a data que ele esta tentando agendar já passou/é antiga
    if(isBefore(hourStart, new Date())){
      return res.status(400).json({error:'data inválida'});
    }
    
    //Verificando se o provider tem o horario escolhido disponivel
    
    const checkAppointment = await Appointment.findOne({
      where:{
        provider_id,
        canceled_at:null,
        date:hourStart,
      }
    })

    if(checkAppointment){
      return res.status(400).json({error:'Data de agendamento não disponível'});
    }
    
    
    const agendamento = await Appointment.create({
      user_id: isUser.id,
      provider_id,
      date
    })
    
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {locale:pt}
    )
    //Email de Agendamento
    await Mail.sendMail({
      to: `${isProvider.name} <${isProvider.email}>`,
      subject: `Agendamento Recebido de ${isUser.name}!`,
      template: 'create',
      context: {
        providers: isProvider.name,
        user: isUser.name,
        date:format(
          agendamento.date,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {locale:pt}
        )},
    });

    //Notificação de agendamento:
    await Notification.create({
      content: `Novo agendamento de ${isUser.name} para ${formattedDate}`,
      user: provider_id,
    })

    return res.json(agendamento);

  }

  async delete(req,res){
    const isUser = await User.findOne(req.userId)

    const agendamento = await Appointment.findByPk(req.params.id, {
      include:[
        {
          model:User,
          as:'user',
          attributes:['name','email'],
        },
        {
          model:Provider,
          as:'providers',
          attributes:['name','email'],
        }
      ]
    });

    //Verificando se o usuario que quer cancelar é o mesmo que agendou
    if(agendamento.user_id !== isUser.id){
      return res.status(401).json({error:'Você não tem permissão para cancelar esse agendamento'});
    }

    //Buscando data do agendamento e diminuindo 3 horas
    const dataSubtraida = subHours(agendamento.date, 3);

    //Verificando se o agendamento pode ser cancelado, pois necessita de 3 horas
    if(isBefore(dataSubtraida, new Date())){
      return res.status(401).json({error:'Você não pode cancelar, pois já passou do prazo!'});
    }

    agendamento.canceled_at = new Date();

    await agendamento.save();

    await Mail.sendMail({
      to: `${agendamento.providers.name} <${agendamento.providers.email}>`,
      subject: 'Infelizmente um agendamento foi cancelado!',
      template: 'cancellation',
      context: {
        providers: agendamento.providers.name,
        user: agendamento.user.name,
        date:format(
          agendamento.date,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {locale:pt}
        )},
    });

    return res.json(agendamento);

  }
}

module.exports = new AppointmentController();