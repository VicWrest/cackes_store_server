const express = require('express');
require('dotenv').config();
const sequelize = require('./db/db');
const models = require('./models/models')
const cors = require("cors");
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require("./middleware/errorHandlerMiddlewares");
const bodyParser = require('body-parser');

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = new express();

app.use(fileUpload({}));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));	
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('static'))

app.use('/api', router);

app.use(errorHandler);
const start = async () =>{
    try{
        await sequelize.authenticate() //подключение к бд
        await sequelize.sync(); //синхронизация
        app.listen(PORT, HOST, () => {
            console.log(`The Server was started in PORT=${PORT}`)
        })
    }
    catch(err){
        console.log(err);
    }
}

start();