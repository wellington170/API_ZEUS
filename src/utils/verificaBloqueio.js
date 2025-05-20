const Membros = require('../apps/models/membros');

async function verificaBloqueio(id) {
    const membro = await Membros.findOne({
        where: { id: id }
    });
    if (!membro) return false;
    if (membro.usuario_bloqueado) {
        const tempoBloqueio = 15 * 60 * 1000; 
        const agora = new Date();
        if (membro.data_bloqueio && (agora - membro.data_bloqueio) > tempoBloqueio) {
            await Membros.update(
                {
                    usuario_bloqueado: false,
                    numero_tentativas: 0,
                    data_bloqueio: null
                },
                { where: { id: id } }
            );
            return false; 
        }
        return true; 
    }
    return false; 
}

module.exports =  verificaBloqueio;