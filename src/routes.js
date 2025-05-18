const {Router}=require('express');
const UserModel=require('./apps/models/membros');
const AuthenticationMiddleware=require('./apps/middlewares/authentication');
const ControleDeMembros = require('./apps/controllers/ControleDeMembros');
const AuthenticationController=require('./apps/controllers/Autenticação');
const ControleOrcamentos=require('./apps/controllers/ControleOrcamentos');

const schemaValidator=require('./apps/middlewares/schemaValidator');
const membroSchema=require('./schema/create_membro.json');
const loginSchema=require('./schema/login_scheme.json');
const firstLoginSchema=require('./schema/fist_login_scheme.json');
const updateSchema=require('./schema/update_schema.json');
const resetSchema=require('./schema/recuperacao_senha_schema.json');
const codigoSchema=require('./schema/envio_codigo_shema.json');
const createOrcamentoSchema=require('./schema/create_orcamento.json');
const updateOrcamentosSchema=require('./schema/update_orcamento.json');
const routes= new Router();
const {upload, verificaErroMulter}=require('./configs/multer');
routes.post('/login', schemaValidator(loginSchema),AuthenticationController.authenticate);
routes.post('/primeiro_login', schemaValidator(firstLoginSchema), AuthenticationController.fistAuthenticate);
routes.post('/login/recuperacao_de_senha/codigo', schemaValidator(codigoSchema), AuthenticationController.codigo);
routes.put('/login/recuperacao_de_senha/reset', schemaValidator(resetSchema), AuthenticationController.reset);

routes.use(AuthenticationMiddleware);
routes.get('/health', (req,res)=>{
    return res.send({message: "Connection is ok!"});
})

routes.post('/adm/create',upload.single('foto'),
schemaValidator(membroSchema),verificaErroMulter, ControleDeMembros.create);
routes.get('/adm/listar', ControleDeMembros.listar);
routes.delete('/adm/delete/:id', ControleDeMembros.delete);
routes.put('/adm/atualizar/:id', upload.single('foto'),
schemaValidator(updateSchema), verificaErroMulter, ControleDeMembros.update);

routes.post('/adm/orcamento/create',schemaValidator(createOrcamentoSchema), ControleOrcamentos.create);
routes.delete('/adm/orcamento/delete/:id', ControleOrcamentos.delete);
routes.put('/adm/orcamento/update/:id',schemaValidator(updateOrcamentosSchema), ControleOrcamentos.update);
routes.get('/adm/orcamento/listar', ControleOrcamentos.listar);
module.exports=routes;
