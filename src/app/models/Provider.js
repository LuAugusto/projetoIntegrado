const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');
const bcrypt = require('bcryptjs');

class Provider extends Model{
  static init(sequelize){
    super.init({
      name:Sequelize.STRING,
      email:Sequelize.STRING,
      password:Sequelize.VIRTUAL,
      password_hash:Sequelize.STRING,
      telefone:Sequelize.STRING,
      endereco:Sequelize.STRING,
      services:Sequelize.STRING,
    },
    {
      sequelize,
    }
    );
    this.addHook('beforeSave',async (provider) => {
      if(provider.password){
        provider.password_hash = await bcrypt.hash(provider.password,8);
      }
    });
    return this;
  };
  //Associando chave estrangeira
  static associate(models){
    this.belongsTo(models.File,{foreignKey:'avatar_id', as: 'avatar'});
  }
  //Checkando validade da senha digitada
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}
module.exports = Provider;