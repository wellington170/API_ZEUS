const Sequelize=require('sequelize');
const Membros=require('../apps/models/membros');
const databaseConfig=require("../configs/db");

const createAdm = require('../utils/createAdm');

const models=[Membros];
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