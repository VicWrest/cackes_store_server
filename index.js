const express = require('express');
require('dotenv').config();
const sequelize = require('./db/db');
const models = require('./models/models')
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require("./middleware/errorHandlerMiddlewares");
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
// const cors = require('./middleware/cors.middleware');
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const TOKEN = process.env.TOKEN_BOT;
const reactHost = process.env.FRONT_HOST

const app = new express();


app.use(fileUpload({}));
app.use(cors({
    origin: reactHost, 
    credentials:true,
    optionSuccessStatus:200
}));
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
        app.listen(PORT, () => {
            console.log(`The Server was started in PORT=${PORT}`)
        })
    }
    catch(err){
        console.log(err);
    }
}

start();

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start'){
        await bot.sendPhoto(chatId, `./static/mainPhoto/startPhoto.jpeg`)            
        await bot.sendMessage(chatId, `Добро пожаловать в Мастерскую домашних десертов Tsyganova's cakes🎂🧁`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Выбрать дессерт', web_app: {url: `https://homestorecackes.netlify.app/`}},
                        {text: 'Корзина', web_app: {url: `https://homestorecackes.netlify.app/basket`}},
                        {text: 'Отзывы', web_app: {url: `https://homestorecackes.netlify.app/review`}},
                    ]
                ]
            }
        })
    }
    if(msg?.web_app_data?.data){
            await controller.sendFormData(bot, msg);
    }
})