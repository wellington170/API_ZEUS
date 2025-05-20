const Orcamentos=require('../models/orcamento');
const Membros=require('../models/membros');
const Clientes=require('../models/clientes');
const verificaAdm=require('../../utils/verificaAdm');

class ControleOrcamentos{
    async create(req,res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para criar um cliente!"});
        const verifyUser=await Clientes.findOne({
                where:{
                    email: req.body.email,
                },
            });
        if(verifyUser) return res.status(400).json({message:"Cliente já existe"});
            
        await Clientes.create(req.body);
        return res.status(200).json({message: "Cliente criado com sucesso!"});
    }
    async delete(req,res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para deletar um cliente!"});
        const {id}=req.params;
        const cliente=await Clientes.findByPk(id);
        if(!cliente) return res.status(404).json({error: "Cliente não foi encontrado"});
        const clienteOrcamentos= await Orcamentos.findOne({
            where:{
                cliente_id:id
            }
        });
        if(clienteOrcamentos) return res.status(403).json({error: "Cliente não pode ser deletado, pois possui orçamentos vinculados!"});
        await Clientes.destroy({
            where:{
                id:id
            }
        });
        return res.status(200).json({message: "Cliente deletado com sucesso!"});
    }
    async listar(req,res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para acessar todos os usuários"});
        const usuarios=await Clientes.findAll({
            order:[['nome', 'ASC']],
            attributes:['id', 
                'nome',
                'email',
                'telefone',
                'endereco']
        });
        return res.status(200).json({data: usuarios});
    }
    async update(req,res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para atualizar um cliente!"});
        const {id}=req.params;
        const cliente=await Clientes.findByPk(id);
        if(!cliente) return res.status(404).json({error: "Cliente não foi encontrado"});
        await Clientes.update(req.body,{
            where:{
                id:id
            }
        });
        return res.status(200).json({message: "Cliente atualizado com sucesso!"});
    }
}

module.exports= new ControleOrcamentos();