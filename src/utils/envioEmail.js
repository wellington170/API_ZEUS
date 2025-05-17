const nodemailer = require('nodemailer');
const mailConfig = require('../configs/emailConfig');

const transporter = nodemailer.createTransport(mailConfig);

async function enviaCodigo(email, code) {
  await transporter.sendMail({
    from: '"Comp Junior "<wellingtoncostagrilo2018@gmail.com>',
    to: email,
    subject: 'Recuperação de senha:',
    text: `Seu código de recuperação ${code} expira em 5 minutos!`,
  });
}

module.exports = { enviaCodigo };