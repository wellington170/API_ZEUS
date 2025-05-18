const Membros=require('../apps/models/membros');
async function verificaAdm(id){
    const adm=await Membros.findOne({
            where: {
                id:id,
            }
        });
        if(adm.administrador) return false;
        else return true;
    }

module.exports=verificaAdm;