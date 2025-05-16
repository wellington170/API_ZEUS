const {Router}=require('express');
const UserModel=require('./apps/models/membros');
const AuthenticationMiddleware=require('./apps/middlewares/authentication');
const ControleDeMembros = require('./apps/controllers/ControleDeMembros');
const AuthenticationController=require('./apps/controllers/Autenticação');

const schemaValidator=require('./apps/middlewares/schemaValidator');
const membroSchema=require('./schema/create_membro.json');
const loginSchema=require('./schema/login_scheme.json');
const firstLoginSchema=require('./schema/fist_login_scheme.json');
const routes= new Router();

routes.post('/login', schemaValidator(loginSchema),AuthenticationController.authenticate);
routes.post('/primeiro_login', schemaValidator(firstLoginSchema), AuthenticationController.fistAuthenticate);

routes.use(AuthenticationMiddleware);
routes.get('/health', (req,res)=>{
    return res.send({message: "Connection is ok!"});
})
routes.post('/adm/create', schemaValidator(membroSchema),ControleDeMembros.create);
routes.get('/adm/listar', ControleDeMembros.listar);
routes.delete('/adm/delete/:id', ControleDeMembros.delete);
routes.put('/adm/atualizar/:id', ControleDeMembros.update);
module.exports=routes;
