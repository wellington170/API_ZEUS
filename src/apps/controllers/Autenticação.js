const jwt=require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Membro=require('../models/membros');
const {encrypt}=require('../../utils/crypt');
class AuthenticationController{
    async authenticate(req, res){
        const {email_institucional,password}=req.body;

        const user=await Membro.findOne({
            where: {email_institucional},
        });
        if(!user) {
            return res.status(401).json({error: 'Membro não encontrado'});
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
            return res.status(401).json({error: 'Membro não encontrado'});
        }
        
        if(user.password_hash!=null) return res.status(400).json({error: "Membro já tem senha cadastrada!"});
        let encryptedPassword='';
        if(password!=confirm_password) return res.status(401).json({error: "As senhas não batem"});
        
        encryptedPassword=await bcryptjs.hash(password, 8);
        user.update({password_hash: encryptedPassword});
        return res.status(200).json({message: "Senha criada com sucesso!"});
    }
    
}
module.exports= new AuthenticationController();