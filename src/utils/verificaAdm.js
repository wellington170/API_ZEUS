const Membros=require('../apps/models/membros');
async function verificaAdm(id){
    const adm=await Membros.findOne({
            where: {
                id:id,
            }
        });
        if(!adm) return false;
        if(adm.administrador) return true;
        else return false;
    }

module.exports=verificaAdm;