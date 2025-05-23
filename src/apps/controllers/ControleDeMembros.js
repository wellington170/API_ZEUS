const Membros=require('../models/membros');
const Orcamentos=require('../models/orcamento');
const verificaTelefone=require('../../utils/verificaTelefone');
const  verificaAdm=require('../../utils/verificaAdm');
const cloudinary = require('../../configs/cloudinary');
const streamifier = require('streamifier');
class ControleDeMembros{
    
    async create(req, res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para criar um usuário" });

            const verificaMembro = await Membros.findOne({
                where: {
                    email_institucional: req.body.email_institucional,
                },
            });
            if (verificaMembro) {
                return res.status(400).json({ error: "Membro já existe" });
            }

            const dataAtual = new Date();
            const user = req.body;
            if (new Date(user.data_de_ingresso) > dataAtual || new Date(user.data_de_nascimento) > dataAtual) {
                return res.status(400).json({ error: "A data de ingresso ou de nascimento são inválidas." });
            }
            if (!user.email_institucional.endsWith("@compjunior.com.br")) {
                return res.status(400).json({ error: "O email deve estar no domínio da compjunior!" });
            }
            if (req.body.administrador === "Sim") req.body.administrador = true;
            else if (req.body.administrador === "Não") req.body.administrador = false;

            const buffer = req.file.buffer;
            const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                resource_type: 'image',
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            },
            async (error, result) => {
                if (error) {
                    return res.status(500).json
                    ({ error: 'Erro ao fazer upload para o Cloudinary!', details: error.message });
                }

                user.foto = result.secure_url;  

                if (!verificaTelefone(user.telefone)) {
                    return res.status(400).json
                    ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
                }

                await Membros.create(user);

                return res.status(200).json({ message: "Membro criado com sucesso!"});
            }
        );

            streamifier.createReadStream(buffer).pipe(uploadStream);

        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }

    async listar(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para acessar todos os usuários" });

            const usuarios = await Membros.findAll({
                order: [['nome_completo', 'ASC']],
                attributes: ['id',
                    'nome_completo',
                    'data_de_nascimento',
                    'cargo',
                    'telefone',
                    'foto',
                    'email_institucional']
            });
            return res.status(200).json({ data: usuarios });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async delete(req, res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para deletar um usuário" });

            const { id } = req.params;
            const user = await Membros.findByPk(id);
            if (!user) return res.status(404).json({ error: "Membro não foi criado" });
            if (id == 1) return res.status(403).json({ error: "Você não pode deletar administrador inicial" });

            const userOrcamentos = await Orcamentos.findOne({
                where: {
                    membro_responsavel_id: id
                }
            });
            if (userOrcamentos) return res.status(403).json
            ({ error: "Você não pode deletar um usuário que é responsável por um orçamento" });


            await Membros.destroy({
                where: {
                    id: id
                }
            });
            return res.status(200).json({ message: "Membro deletado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
    async update(req,res){
        try {
            if (!await verificaAdm(req.userId)) return res.status(400).json
            ({ error: "Você não tem permissão para alterar um usuário" });
            
            const { id } = req.params;
            const user = await Membros.findByPk(id);
            if (!user) return res.status(404).json({ error: "Membro não foi criado" });
            if (id == 1) return res.status(403).json({ error: "Você não pode alterar o administrador inicial!" });
            if (req.body.administrador === "Sim") req.body.administrador = true;
            else if (req.body.administrador === "Não") req.body.administrador = false;
            const {
                nome_completo,
                email_institucional,
                cargo,
                telefone,
                administrador,
                genero,
                habilidades
            } = req.body;
            if (!user.email_institucional.endsWith("@compjunior.com.br")) {
                return res.status(400).json({ error: "O email deve estar no domínio da compjunior!" });
            }
            if(!verificaTelefone(telefone)) return res.status(400).json
            ({ error: "Telefone inválido ou não está no formato: (xx)xxxxx-xxxx ou xxxxxxxxxxx)" });
            let foto = user.foto;
            if (req.file) {
                const buffer = req.file.buffer;

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'uploads',
                            resource_type: 'image',
                            transformation: [{ width: 500, height: 500, crop: 'limit' }],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );

                    streamifier.createReadStream(buffer).pipe(uploadStream);
                });

            foto = uploadResult.secure_url;  
        }
            await Membros.update(
                {
                    nome_completo: nome_completo || user.nome_completo,
                    email_institucional: email_institucional || user.email_institucional,
                    cargo: cargo || user.cargo,
                    foto: foto,
                    telefone: telefone || user.telefone,
                    administrador: administrador ?? user.administrador,
                    genero: genero || user.genero,
                    habilidades: habilidades || user.habilidades
                },
                {
                    where: { id: id }
                });
            return res.status(200).json({ message: "Membro atualizado com sucesso!" });
        } catch (err) {
            return res.status(500).json({ error: "Erro interno no servidor!" });
        }
    }
}

module.exports=new ControleDeMembros();