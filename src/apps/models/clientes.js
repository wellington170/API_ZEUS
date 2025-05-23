const Sequelize=require('sequelize');
const {Model}=require('sequelize');

class Clientes extends Model{
    static init(sequelize){
        super.init({
            nome: Sequelize.STRING,
            cpf_cnpj:Sequelize.STRING,
            email: Sequelize.STRING,
            telefone: Sequelize.STRING,
            cep: Sequelize.STRING,
            rua: Sequelize.STRING,
            bairro: Sequelize.STRING,
            cidade: Sequelize.STRING,
            estado: Sequelize.STRING,
            numero: Sequelize.STRING,
        },{
            sequelize
        });
        return this;
    }
}
module.exports=Clientes;