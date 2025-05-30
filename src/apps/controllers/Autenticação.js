const jwt=require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Membro=require('../models/membros');
const {encrypt}=require('../../utils/crypt');
const { setResetCode, getResetCode, deleteResetCode }=require('../../utils/resetPassword');
const {enviaCodigo}=require('../../utils/envioEmail');
const verificaBloqueio=require('../../utils/verificaBloqueio');
class AuthenticationController{
    async authenticate(req, res){
        try {
            const { email_institucional, password } = req.body;

            const user = await Membro.findOne({
                where: { email_institucional },
            });
            if (!user) {
                return res.status(401).json
                ({ error: 'Email não cadastrado!' });
            }
            if (user.password_hash === null) {
                return res.status(400).json({ error: 'Você precisa criar a sua senha!' });
            }
            verificaBloqueio(user.id);
            if (user.usuario_bloqueado) return res.status(403).json
            ({ error: 'Conta temporariamente bloqueada!' });

            if (!await user.checkPassword(password)) {
                if (user.id != 1) {
                    await Membro.update({
                        numero_tentativas: user.numero_tentativas + 1
                    },
                        {
                            where: { id: user.id }
                        });
                    if (user.numero_tentativas >= 4) {
                        await Membro.update({
                            usuario_bloqueado: true,
                            data_bloqueio: new Date()
                        },
                            {
                                where: { id: user.id }
                            });
                    }
                }
                return res.status(401).json({ error: 'Senha incorreta!' });

            }

            if (user.numero_tentativas != 0) {
                await Membro.update({
                    numero_tentativas: 0
                },
                    {
                        where: { id: user.id }
                    });
            }
            const { id, nome_completo } = user;
            const { iv, content } = encrypt(id);
            const newId = `${iv}:${content}`;

            const token = jwt.sign({ userId: newId }, process.env.HASH_BCRYPT, {
                expiresIn: '7d'
            })
            return res.status(200).json({ user: { id, nome_completo }, token: token });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }

    async fistAuthenticate(req, res){
        try {
            const { email_institucional, password, confirm_password } = req.body;
            const user = await Membro.findOne({
                where: { email_institucional },
            });
            if (!user) return res.status(401).json({ error: 'Email não cadastrado!' });
            

            if (user.password_hash != null) return res.status(400).json
            ({ error: "Membro já tem senha cadastrada!" });
            let encryptedPassword = '';
            if (password != confirm_password) return res.status(401).json
            ({ error: "As senhas estão diferentes!" });

            encryptedPassword = await bcryptjs.hash(password, 8);
            await user.update({ password_hash: encryptedPassword });
            return res.status(200).json({ message: "Senha criada com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async reset(req, res){
        try {
            const { email_institucional, codigo, new_password, confirm_password } = req.body;
            const user = await Membro.findOne({
                where: {
                    email_institucional: email_institucional
                }
            });
            if (!user) return res.status(401).json({ error: 'Email não cadastrado!' });
            if (new_password != confirm_password) return res.status(400).json
            ({ error: 'As senhas não coincidem!' });

            verificaBloqueio(user.id);
            if (user.usuario_bloqueado) return res.status(403).json
            ({ error: 'Conta temporariamente bloqueada!' });

            const codigoSalvo = getResetCode(email_institucional);
            if (!codigoSalvo || codigoSalvo !== codigo) return res.status(400).json
            ({ error: 'Código inválido ou expirado!' });

            const encryptedPassword = await bcryptjs.hash(new_password, 8);
            await user.update({ password_hash: encryptedPassword });

            deleteResetCode(email_institucional);

            return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    
    async codigo(req, res){
        try {
            const { email_institucional } = req.body;
            const user = await Membro.findOne({
                where: {
                    email_institucional: email_institucional
                }
            });
            if (!user) return res.status(401).json({ error: 'Email não cadastrado!' });
            verificaBloqueio(user.id);

            if (user.usuario_bloqueado) return res.status(403).json
            ({ error: 'Conta temporariamente bloqueada!' });

            if(user.id === 1) return res.status(403).json
            ({ error: 'Você não pode redefinir a senha do administrador inicial!' });

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setResetCode( email_institucional, code);
            try{
            await enviaCodigo(user.nome_completo,email_institucional, code);
            return res.status(200).json({ message: 'Código enviado para o email.' });
            } catch (err) {
                return res.status(500).json({ error: 'Erro ao enviar email.' });
            }
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao enviar email.' });
        }
    }
}
module.exports= new AuthenticationController();