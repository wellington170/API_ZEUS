const Sequelize=require('sequelize');
const {Model}=require('sequelize');
const bcryptjs = require('bcryptjs');

class Membros extends Model{
    static init(sequelize){
        super.init(
            {
            nome_completo: Sequelize.STRING,
            data_de_nascimento: Sequelize.DATE,
            data_de_ingresso: Sequelize.DATE,
            email_institucional: Sequelize.STRING,
            genero: Sequelize.STRING,
            foto: Sequelize.STRING,
            cargo: Sequelize.STRING,
            telefone: Sequelize.STRING,
            administrador: Sequelize.BOOLEAN,
            password_hash: Sequelize.STRING,
            habilidades: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            numero_tentativas: Sequelize.INTEGER,
            usuario_bloqueado:  Sequelize.BOOLEAN,
            data_bloqueio: Sequelize.DATE
        },
        {
            sequelize,
        },
    );
    return this;
    }
    checkPassword(password) {
    return bcryptjs.compare(password, this.password_hash);
  }
}
module.exports=Membros;