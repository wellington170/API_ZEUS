module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('membros', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome_completo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_de_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_de_ingresso: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      email_institucional: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      genero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cargo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      habilidades:{
        type: Sequelize.STRING,
        allowNull:true,
      },
        password_hash:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      administrador:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      numero_tentativas:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      usuario_bloqueado:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,        
      },
      data_bloqueio:{
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('membros');
  }
};