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
const orderController = require('./controllers/orderController');
const commands = require('./tg-commands/commands');
const botController = require('./controllers/botController');
const { startOptions, editOrderButtons } = require('./tg-options/options');
const { confirmPhone, welcome, badRequest, getCommands, goToCart, serverError, restartBot, acceptOrder } = require('./options/options');

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

bot.setMyCommands(commands)

bot.on('message', async msg => {
    console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;
    const replyText = msg?.reply_to_message?.text;
    if(replyText === confirmPhone){
        return;
    }
    if(msg?.via_bot){
        return;
    }
    if(text === '/start'){
        await bot.sendPhoto(chatId, process.env.MAIN_PHOTO_PATH)            
        return await bot.sendMessage(chatId, welcome, startOptions)
    }
    if(text === '/myOrders'){
        botController.getOrders(bot, msg);   
        return; 
    }
    else {
        await bot.sendMessage(chatId, badRequest);
        await bot.sendPhoto(chatId, INSTRUCTION_PHOTO_PATH) 
        return await bot.sendMessage(chatId, getCommands)
    }
})

bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id;
    const {data} = msg;
    const obj = JSON.parse(data);
        try{
            if(obj.answer === 'yes'){
                await orderController.orderConfirm(bot, msg, obj);
            }

            if(obj.answer === 'no'){
                await orderController.orderCancell(bot, msg, obj)
                return await bot.sendMessage(chatId, goToCart, editOrderButtons)
            }
            orderController.creatingNewOrder(bot, msg);
        }
        catch(err){
            console.log(err)
            bot.sendMessage(chatId, serverError);
            bot.sendMessage(chatId, restartBot);
        }
    });

    bot.on('contact', async msg=> {
            const chatId = msg.chat.id;
        try {
            await bot.sendMessage(chatId, acceptOrder, {
                reply_markup: {
                    remove_keyboard: true
                }
            })
            await bot.sendContact(process.env.ADMIN_CHAT_ID, msg.contact.phone_number, `Контакт`);
        }
        catch(error) {
            console.log(error);
        }
    })

