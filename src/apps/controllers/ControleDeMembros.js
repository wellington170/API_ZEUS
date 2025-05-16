const Membros=require('../models/membros');

class ControleDeMembros{
    
    async create(req, res){
        const adm=await Membros.findOne({
            where: {
                id:req.userId,
            }
        });
        if(!adm.administrador) return res.status(400).json({error: "Você não tem permissão para criar um usuário"});
        const verifyUser=await Membros.findOne({
                where:{
                    email_institucional: req.body.email_institucional,
                },
            });
            if(verifyUser){
                return res.status(400).json({message:"Membro já existe"});
            }
        const dataAtual=new Date();
        const user=req.body;
        if(new Date(user.data_de_ingresso)>dataAtual || new Date(user.data_de_nascimento)>dataAtual){
            return res.status(400).json({ error: "A data de ingresso ou de nascimento são inválidas." });
        }
        await Membros.create(req.body);
        return res.status(200).json({message: "Membro criado com sucesso!"});
    }

    async listar(req,res){
        const adm=await Membros.findOne({
            where: {
                id:req.userId,
            }
        });
        if(!adm.administrador) return res.status(400).json({error: "Você não tem permissão para criar um usuário"});
        const usuarios=await Membros.findAll({
            order:[['nome_completo', 'ASC']],
            attributes:['id', 
                'nome_completo',
                'data_de_nascimento',
                'cargo',
                'telefone',
                'email_institucional']
        });
        return res.status(200).json({data: usuarios});
    }
    async delete(req, res){
        const adm=await Membros.findOne({
            where: {
                id:req.userId,
            }
        });
        if(!adm.administrador) return res.status(400).json({error: "Você não tem permissão para criar um usuário"}); 

        const {id}=req.params;
        const user=await Membros.findByPk(id);
        if(!user)  return res.status(404).json({error: "Membro não foi criado"});
        if(id==1) return res.status(403).json({error: "Você não pode deletar administrador inicial"});

        
        await Membros.destroy({
            where:{
                id:id
            }
        });
        return res.status(200).json({message: "Membro deletado com sucesso!"});
    }
    async update(req,res){
        const adm=await Membros.findOne({
            where: {
                id:req.userId,
            }
        });
        if(!adm.administrador) return res.status(400).json({error: "Você não tem permissão para criar um usuário"}); 

        const {id}=req.params;
        const user=await Membros.findByPk(id);
        if(!user)  return res.status(404).json({error: "Membro não foi criado"});
        if(id==1) return res.status(403).json({error: "Você não pode alterar o administrador inicial!"});

        const{nome_completo,
            email_institucional,
            cargo,
            foto,
            telefone,
            administrador,
            genero
        } = req.body;
        await Membros.update(
        {
            nome_completo: nome_completo || user.nome_completo,
            email_institucional: email_institucional || user.email_institucional,
            cargo: cargo || user.cargo,
            foto: foto || user.foto,
            telefone: telefone || user.telefone,
            administrador: administrador ?? user.administrador,
            genero: genero||user.genero
        },
        {
            where: { id: id }
        });
        return res.status(200).json({message: "Membro atualizado com sucesso!"});
    }
    }

module.exports=new ControleDeMembros();