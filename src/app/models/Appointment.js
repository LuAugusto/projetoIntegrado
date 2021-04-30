const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

const {isBefore, subHours} = require('date-fns');

class Appointment extends Model{
  static init(sequelize){
    super.init({
      date:Sequelize.DATE,
      canceled_at:Sequelize.DATE,
      past:{
        type:Sequelize.VIRTUAL,
        get(){
          return isBefore(this.date, new Date());
        },
      },
      cancelable:{
        type:Sequelize.VIRTUAL,
        get(){
          return isBefore(new Date(), subHours(this.date,3));
        }
      }
    },
    {
      sequelize,
    }
    );
    return this;
  }
  static associate(models){
    this.belongsTo(models.Provider, {foreignKey:'provider_id', as: 'providers'});
    this.belongsTo(models.User,{foreignKey:'user_id', as: 'user'});
  }
}

module.exports = Appointment;