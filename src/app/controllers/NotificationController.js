const Notification = require('../schemas/Notification');
const Provider = require('../models/Provider');

class NotificationController{
  async index(req,res){

    const isProvider = await Provider.findOne({
      where:{email:req.userId}
    });

    const notifications = await Notification.find({
      user:isProvider.id
    }).sort({createdAt:'desc'}).limit(20);

    return res.json(notifications);
  }
}
module.exports =  new NotificationController();