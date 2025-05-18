const Sequelize=require('sequelize');
const Membros=require('../apps/models/membros');
const Orçamentos=require('../apps/models/orcamento');
const databaseConfig=require("../configs/db");

const createAdm = require('../utils/createAdm');

const models=[Membros, Orçamentos];
class Database{
    constructor(){
        this.init();
    }
      async init(){
        this.connection = new Sequelize(databaseConfig);
        models
        .map(model=> model.init(this.connection));

        await createAdm();
    }
    
};

module.exports=new Database();