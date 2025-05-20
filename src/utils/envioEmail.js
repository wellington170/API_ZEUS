const nodemailer = require('nodemailer');
const mailConfig = require('../configs/emailConfig');

const transporter = nodemailer.createTransport(mailConfig);

async function enviaCodigo(email, code) {
  await transporter.sendMail({
    from: '"Equipe de suporte - Comp Júnior "<wellingtoncostagrilo2018@gmail.com>',
    to: email,
    subject: 'Recuperação de senha-Comp Júnior',
    text: `Olá,
    Recebemos uma solicitação para redefinir a sua senha.
    Utilize o código abaixo para prosseguir com a recuperação da sua conta:

    Código de recuperação: ${code}

    Este código é válido por apenas 5 minutos. 
    Se você não solicitou essa alteração, ignore este e-mail.

    Atenciosamente,
    Equipe de Suporte - Comp Júnior`
  });
}

module.exports = { enviaCodigo };