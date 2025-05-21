
class FileController {
    async upload(req,res){
        try{
        const {filename}=req.file;
        return res.status(200).json({url: `uploads/${filename}`});
    }  catch(err){
        return res.status(500).json({error: "Erro ao fazer upload da foto!"});
    }
}
}
module.exports= new FileController();