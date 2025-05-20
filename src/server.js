
require('./database/index');
require('dotenv').config();
const express=require('express');
const routes = require('./routes');
const app=express();

app.use(express.json());

app.use(routes);
const {PORT}=process.env;
app.listen(PORT, ()=>{
    console.log('Server is on port 3001');
}); 