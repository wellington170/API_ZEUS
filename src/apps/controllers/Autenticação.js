const jwt=require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Membro=require('../models/membros');
const {encrypt}=require('../../utils/crypt');
const { setResetCode, getResetCode, deleteResetCode }=require('../../utils/resetPassword');
const {enviaCodigo}=require('../../utils/envioEmail');
class AuthenticationController{
    async authenticate(req, res){
        const {email_institucional,password}=req.body;

        const user=await Membro.findOne({
            where: {email_institucional},
        });
        if(!user) {
            return res.status(401).json({error: 'Email não cadastrado!'});
        }
        if(user.password_hash===null){
            return res.status(400).json({error: 'Você precisa criar a sua senha!'});
        }
        if(!await user.checkPassword(password)){
            return res.status(401).json({error: 'Senha incorreta!'});
        }
        const {id, nome_completo}=user;
        const {iv, content}= encrypt(id);
        const newId=`${iv}:${content}`;

        const token=jwt.sign({userId: newId}, process.env.HASH_BCRYPT, {
            expiresIn: '7d'
        })
        return res.status(200).json({user:{id, nome_completo}, token: token});
    }

    async fistAuthenticate(req, res){
         const {email_institucional,password, confirm_password}=req.body;
         const user=await Membro.findOne({
            where: {email_institucional},
        });
        if(!user) {
            return res.status(401).json({error: 'Email não cadastrado!'});
        }
        
        if(user.password_hash!=null) return res.status(400).json({error: "Membro já tem senha cadastrada!"});
        let encryptedPassword='';
        if(password!=confirm_password) return res.status(401).json({error: "As senhas estão diferentes!"});
        
        encryptedPassword=await bcryptjs.hash(password, 8);
        user.update({password_hash: encryptedPassword});
        return res.status(200).json({message: "Senha criada com sucesso!"});
    }
    async reset(req, res){
        const {email_institucional, codigo, new_password, confirm_password}=req.body;
        const user= await Membro.findOne({
            where:{
                email_institucional: email_institucional
            }
        });
        if(!user) return res.status(401).json({error: 'Email não cadastrado!'});
        if(new_password!=confirm_password) return res.status(400).json({error: 'As senhas não coincidem!'});

        const codigoSalvo=getResetCode(email_institucional);
        if (!codigoSalvo || codigoSalvo !== codigo) return res.status(400).json({ error: 'Código inválido ou expirado!' });
  
        const encryptedPassword = await bcryptjs.hash(new_password, 8);
        await user.update({ password_hash: encryptedPassword });

        deleteResetCode(email_institucional);

        return res.status(200).json({ message: 'Senha redefinida com sucesso!' });

    }
    async codigo(req, res){
        const {email_institucional}=req.body;
        const user= await Membro.findOne({
            where:{
                email_institucional: email_institucional
            }
        });
        if(!user) return res.status(401).json({error: 'Email não cadastrado!'});

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setResetCode(email_institucional, code);

        try {
            await enviaCodigo(email_institucional, code);
            return res.status(200).json({ message: 'Código enviado para o email.' });
        }   catch (err) {
        return res.status(500).json({ error: 'Erro ao enviar email.' });
    }

    }
}
module.exports= new AuthenticationController();