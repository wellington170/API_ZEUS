const bcryptjs = require('bcryptjs');
const Membros = require('../apps/models/membros');

async function createAdm() {
  const adminExists = await Membros.findOne({ where: { administrador: true } });
  if (!adminExists) {
    const senhaInicial = 'admin123';
    const senhaHash = await bcryptjs.hash(senhaInicial, 8);

    await Membros.create({
      nome_completo: 'Administrador Inicial',
      data_de_nascimento: '1990-01-01',
      data_de_ingresso: new Date(),
      email_institucional: 'adm@compjunior.com.br',
      genero: 'Masculino',
      foto: 'sem_foto',
      cargo: 'Administrador',
      telefone: '31999999999',
      administrador: true,
      password_hash: senhaHash
    });

    console.log('Administrador inicial criado com sucesso!');
  } 
}

module.exports = createAdm;