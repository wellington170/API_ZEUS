const Orcamentos=require('../models/orcamento');
const Membros=require('../models/membros');
const verificaAdm=require('../../utils/verificaAdm');
class ControleOrcamentos{

    async create(req, res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para criar um orçamento!"});

        const{numero_do_orcamento}=req.body;
        const orcamento=req.body;
        const membro=await Membros.findOne({
            where:{
                id:orcamento.membro_responsavel_id
            }
        });

        if(!membro) return res.status(404).json({error: "Membro não foi criado"});
        if(orcamento.membro_responsavel_id===1) return res.status(400).json
        ({error: "O admin inicial não pode ser responsável por um orçamento!"});
        const verifyOrcamento=await Orcamentos.findOne({
            where:{
                numero_do_orcamento: numero_do_orcamento,
            }
        });
        if(verifyOrcamento ) return res.status(400).json({error: "Número do orçamento já existe!"});
        const novoOrcamento = await Orcamentos.create(req.body);
        await Orcamentos.update(
            {
                membro_responsavel:membro.nome_completo
            },
            {
                where:{
                    id:novoOrcamento.id
                }
            }
    );
        return res.status(200).json({message: "Orçamento criado com sucesso!"});
    }
    async delete(req,res){

        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para deletar um orçamento!"});
        const {id}=req.params;
        const orcamento=await Orcamentos.findByPk(id);
        if(!orcamento) return res.status(404).json({error: "O orçamento solicitado não existe"});

        await Orcamentos.destroy({
            where:{
                id:id
            }
        });
        return res.status(200).json({message: "Orçamento deletado com sucesso!"});
    }
       async listar(req, res){

        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para acessar todos os orçamentos!"});
        const orcamentos=await Orcamentos.findAll({
            order:[['id', 'DESC']],
            attributes: ['id',
                'numero_do_orcamento',
                'descricao_do_projeto',
                'membro_responsavel',
                'membro_responsavel_id',
                'valor_estimado',
                'custos_previstos',
                'status_orcamento',
                'cliente_id'
            ]
        });
        return res.status(200).json({data: orcamentos});
       }
       async update(req, res){
        if(!await verificaAdm(req.userId)) return res.status(400).json({error: "Você não tem permissão para alterar um orçamento"});
        const {id}=req.params;
        const orcamento=await Orcamentos.findByPk(id);
        if(!orcamento) return res.status(404).json({error: "O orçamento solicitado não existe"});
        
        const {descricao_do_projeto,
            membro_responsavel_id,
            valor_estimado,
            custos_previstos,
            status_orcamento
        }=req.body;
        const novo_responsavel =await Membros.findByPk(membro_responsavel_id);
        if(!novo_responsavel) return res.status(404).json({error: "O membro requisitado não existe!"});
        if(membro_responsavel_id===1) return res.status(400).json
        ({error: "O admin inicial não pode ser responsável por um orçamento!"});
        await Orcamentos.update({
            descricao_do_projeto: descricao_do_projeto||orcamento.descricao_do_projeto,
            membro_responsavel_id: membro_responsavel_id||orcamento.membro_responsavel_id,
            valor_estimado: valor_estimado||orcamento.valor_estimado,
            custos_previstos: custos_previstos||orcamento.custos_previstos,
            status_orcamento: status_orcamento||orcamento.status_orcamento
        },
        {
            where: {id: id}
        });
        await Orcamentos.update(
            {
                membro_responsavel: novo_responsavel.nome_completo
            },
            {
                where:{
                    id:id
                }
            }
        );
        return res.status(200).json({message: "Orçamento atualizado com sucesso!"});
       }
}
module.exports=new ControleOrcamentos();