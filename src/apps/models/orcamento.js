const Sequelize=require('sequelize');
const {Model}=require('sequelize');

class orcamentos extends Model{
    static init(sequelize){
        super.init({
            numero_do_orcamento: Sequelize.INTEGER,
            descricao_do_projeto: Sequelize.STRING,
            cliente: Sequelize.STRING,
            membro_responsavel: Sequelize.STRING,
            membro_responsavel_id: Sequelize.INTEGER,
            valor_estimado: Sequelize.STRING,
            custos_previstos: Sequelize.STRING,
            status_orcamento: Sequelize.STRING
        },
        {
            sequelize,
        },
    ); 
    return this;
    }
    static associate(models){
        this.belongsTo(models.Membros, {foreignKey:'membro_responsavel_id', as: 'membro' });
    }
}
module.exports = orcamentos;