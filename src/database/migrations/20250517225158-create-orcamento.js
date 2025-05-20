module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orcamentos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      numero_do_orcamento:{
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao_do_projeto:{
        type: Sequelize.STRING,
        allowNull: false
      },
      cliente:{
        type: Sequelize.STRING,
        allowNull: false
      },
        membro_responsavel:{
        type: Sequelize.STRING,
        allowNull: true
      },
      membro_responsavel_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'membros', 
          key: 'id'
        },
      },
      valor_estimado:{
        type: Sequelize.STRING,
        allowNull: false
      },
      custos_previstos:{
        type: Sequelize.STRING,
        allowNull: false
      },
      status_orcamento:{
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orcamentos');
  }
};