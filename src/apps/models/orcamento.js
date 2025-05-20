const Sequelize=require('sequelize');
const {Model}=require('sequelize');

class orcamentos extends Model{
    static init(sequelize){
        super.init({
            numero_do_orcamento: Sequelize.INTEGER,
            descricao_do_projeto: Sequelize.STRING,
            membro_responsavel: Sequelize.STRING,
            membro_responsavel_id: Sequelize.INTEGER,
            valor_estimado: Sequelize.STRING,
            custos_previstos: Sequelize.STRING,
            status_orcamento: Sequelize.STRING,
            cliente_id: Sequelize.INTEGER
        },
        {
            sequelize,
        },
    ); 
    return this;
    }
    static associate(models){
        this.belongsTo(models.Membros, {foreignKey:'membro_responsavel_id', as: 'membro' });
        this.belongsTo(models.Clientes, {foreignKey:'cliente_id', as: 'cliente' });
    }
}
module.exports = orcamentos;