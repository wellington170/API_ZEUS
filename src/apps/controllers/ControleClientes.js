const Orcamentos=require('../models/orcamento');
const Membros=require('../models/membros');
const Clientes=require('../models/clientes');
const verificaAdm=require('../../utils/verificaAdm');
const verificaCpfCnpj=require('../../utils/verificaCpfCnpj');
const verificaTelefone=require('../../utils/verificaTelefone');
const verificaCEP=require('../../utils/verificaCEP');

class ControleOrcamentos{
    async create(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para criar um cliente!" });

            const verifyCliente = await Clientes.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (verifyCliente) return res.status(400).json({ message: "Cliente já existe" });

            const user = req.body;
            const {cpf_cnpj, telefone}=req.body;
            if(!verificaCpfCnpj(cpf_cnpj)) return res.status(400).json
            ({ error: "CPF/CNPJ inválido, coloque no formato: XXX.XXX.XXX.XX ou XX.XXX.XXX/XXXX-XX" });

            const verificaCpfRepetido = await Clientes.findOne({
                where: {
                    cpf_cnpj: cpf_cnpj,
                },
            });
            if(verificaCpfRepetido) return res.status(400).json
            ({ error: "CPF/CNPJ já está cadastrado!" });
            if(!verificaTelefone(telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
            if(!await verificaCEP(user)) return res.status(400).json
            ({ error: "CEP inválido ou não encontrado!" });

            await Clientes.create(user);
            return res.status(200).json({ message: "Cliente criado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async delete(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para deletar um cliente!" });

            const { id } = req.params;
            const cliente = await Clientes.findByPk(id);
            if (!cliente) return res.status(404).json({ error: "Cliente não foi encontrado" });
            const clienteOrcamentos = await Orcamentos.findOne({
                where: {
                    cliente_id: id
                }
            });
            if (clienteOrcamentos) return res.status(403).json
            ({ error: "Cliente não pode ser deletado, pois possui orçamentos vinculados!" });

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
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para acessar todos os usuários" });

            const clientes = await Clientes.findAll({
                order: [['nome', 'ASC']],
                attributes: ['id',
                    'nome',
                    'email',
                    'telefone',
                    'cpf_cnpj',
                    'CEP',
                    'Rua',
                    'Bairro',
                    'Cidade',
                    'Estado',
                    'Numero']
            });
            return res.status(200).json({ data: clientes });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async update(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para atualizar um cliente!" });
            
            const { id } = req.params;
            const cliente = await Clientes.findByPk(id);
            if (!cliente) return res.status(404).json({ error: "Cliente não foi encontrado" });
            const user= req.body;
            if (user.email) {
                const verifyEmail = await Clientes.findOne({
                    where: {
                        email: user.email,
                    },
                });
                if (verifyEmail) return res.status(400).json({ error: "Email já existe" });
            }
            if(!verificaTelefone(user.telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });

            if(user.cep){
                if(!await verificaCEP(user)) return res.status(400).json
                ({ error: "CEP inválido ou não encontrado!" });
            }
            await Clientes.update(
                {
                    nome: user.nome || cliente.nome,
                    email: user.email || cliente.email,
                    telefone: user.telefone || cliente.telefone,
                    cep: user.cep || cliente.cep,
                    numero: user.numero || cliente.numero,
                    rua: user.rua || cliente.rua,
                    bairro: user.bairro || cliente.bairro,
                    cidade: user.cidade || cliente.cidade,
                    estado: user.estado || cliente.estado,
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