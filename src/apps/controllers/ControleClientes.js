const Orcamentos=require('../models/orcamento');
const Membros=require('../models/membros');
const Clientes=require('../models/clientes');
const verificaAdm=require('../../utils/verificaAdm');
const verificaCpfCnpj=require('../../utils/verificaCpfCnpj');
const verificaTelefone=require('../../utils/verificaTelefone');
class ControleOrcamentos{
    async create(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json({ error: "Você não tem permissão para criar um cliente!" });
            const verifyCliente = await Clientes.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (verifyCliente) return res.status(400).json({ message: "Cliente já existe" });
            const {cpf_cnpj, telefone}=req.body;
            if(!verificaCpfCnpj(cpf_cnpj)) return res.status(400).json
            ({ error: "CPF/CNPJ inválido, coloque no formato: XXX.XXX.XXX.XX ou XX.XXX.XXX/XXXX-XX" });
            if(!verificaTelefone(telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
            await Clientes.create(req.body);
            return res.status(200).json({ message: "Cliente criado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async delete(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json({ error: "Você não tem permissão para deletar um cliente!" });
            const { id } = req.params;
            const cliente = await Clientes.findByPk(id);
            if (!cliente) return res.status(404).json({ error: "Cliente não foi encontrado" });
            const clienteOrcamentos = await Orcamentos.findOne({
                where: {
                    cliente_id: id
                }
            });
            if (clienteOrcamentos) return res.status(403).json({ error: "Cliente não pode ser deletado, pois possui orçamentos vinculados!" });
            await Clientes.destroy({
                where: {
                    id: id
                }
            });
            return res.status(200).json({ message: "Cliente deletado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }

    async listar(req,res){
         try {
            if (!await verificaAdm(req.userId)) return res.status(400).json({ error: "Você não tem permissão para acessar todos os usuários" });
            const clientes = await Clientes.findAll({
                order: [['nome', 'ASC']],
                attributes: ['id',
                    'nome',
                    'email',
                    'telefone',
                    'cpf_cnpj',
                    'endereco']
            });
            return res.status(200).json({ data: clientes });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async update(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json({ error: "Você não tem permissão para atualizar um cliente!" });
            const { id } = req.params;
            const cliente = await Clientes.findByPk(id);
            if (!cliente) return res.status(404).json({ error: "Cliente não foi encontrado" });
            const { email, telefone, nome, endereco} = req.body;
            if (email) {
                const verifyEmail = await Clientes.findOne({
                    where: {
                        email: email,
                    },
                });
                if (verifyEmail) return res.status(400).json({ error: "Email já existe" });
            }
            if(!verificaTelefone(telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
            await Clientes.update(
                {
                    nome: nome || cliente.nome,
                    email: email || cliente.email,
                    telefone: telefone || cliente.telefone,
                    endereco: endereco || cliente.endereco,
                },
                {
                    where: {
                        id: id
                    }
                });

            return res.status(200).json({ message: "Cliente atualizado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
}

module.exports= new ControleOrcamentos();