const Orcamentos=require('../models/orcamento');
const Membros=require('../models/membros');
const verificaTelefone=require('../../utils/verificaTelefone');

class ControleDosMembros{
    async updateMembro(req,res){
        try {
            const user = await Membros.findByPk(req.userId);
            if (req.userId == 1) return res.status(403).json({ error: "O Administrador inicial não pode ser alterado" });

            const {
                nome_completo,
                email_institucional,
                telefone,
                genero,
                foto,
                habilidades
            } = req.body;

            if (!email_institucional.endsWith("@compjunior.com.br")) {
                return res.status(400).json({ error: "O email deve estar no domínio da compjunior!" });
            }
            if(!verificaTelefone(telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
            await Membros.update(
                {
                    nome_completo: nome_completo || user.nome_completo,
                    email_institucional: email_institucional || user.email_institucional,
                    foto: foto || user.foto,
                    telefone: telefone || user.telefone,
                    genero: genero || user.genero,
                    habilidades: habilidades || user.habilidades
                },
                {
                    where: { id: req.userId }
                }
            );
            return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async listar(req, res){
        try {
            if (req.userId == 1) return res.status(403).json({ error: "O administrador inicial não é responsável por nenhum orçamento!" });
            const orcamentos = await Orcamentos.findAll({
                where: { membro_responsavel_id: req.userId }
            });

            res.status(200).json({ data: orcamentos });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }

    async updateOrcamento(req,res){
        try {
            if (req.userId == 1) return res.status(403).json({ error: "O administrador inicial não é responsável por nenhum orçamento!" });
            const { id } = req.params;
            const orcamento = await Orcamentos.findOne({
                where: { id: id, membro_responsavel_id: req.userId }
            });
            if (!orcamento) return res.status(404).json({ error: "O orçamento solicitado não existe" });

            const {
                descricao_do_projeto,
                valor_estimado,
                custos_previstos,
                status_orcamento
            } = req.body;

            await Orcamentos.update({
                descricao_do_projeto: descricao_do_projeto || orcamento.descricao_do_projeto,
                valor_estimado: valor_estimado || orcamento.valor_estimado,
                custos_previstos: custos_previstos || orcamento.custos_previstos,
                status_orcamento: status_orcamento || orcamento.status_orcamento
            },
                {
                    where: { id: id }
                }
            );
            return res.status(200).json({ message: "Orçamento atualizado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
}

module.exports=new ControleDosMembros;