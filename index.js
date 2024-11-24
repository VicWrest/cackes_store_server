const express = require('express');
require('dotenv').config();
const sequelize = require('./db/db');
const models = require('./models/models')
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require("./middleware/errorHandlerMiddlewares");
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const { creatingNewOrder } = require('./controllers/orderController');
const commands = require('./tg-commands/commands');
const { getErrorAndInstruction } = require('./controllers/botController');
const botController = require('./controllers/botController');
const { startOptions } = require('./tg-options/options');

const PORT = process.env.PORT || 8000;
const TOKEN = process.env.TOKEN_BOT;
const reactHost = process.env.FRONT_HOST

const app = new express();
const bot = new TelegramBot(TOKEN, {polling: true});


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

app.use('/api', function(req, res, next){
    req.bot = bot;
    next();
}, router);

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

bot.setMyCommands([
    {command: '/start', description: 'Перейти в домашнюю мастерскую'},
    {command: '/myorders', description: 'Мои заказы'}
    
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if(text === '/start'){
        await bot.sendPhoto(chatId, './static/mainPhoto/startPhoto.jpeg')            
        return await bot.sendMessage(chatId, `Добро пожаловать в домашнюю Мастерскую вкусных десертов Tsyganova's cakes🎂🧁`, startOptions)
    }
    if(text === '/myOrders'){
        botController.getOrders(bot, msg);   
        return; 
    }
    else {
        getErrorAndInstruction(bot, msg)
        return;
    }
})

bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id;
        try{
            creatingNewOrder(bot, msg);
        }
        catch(err){
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
    });

