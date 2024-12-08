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
const { getErrorAndInstruction } = require('./controllers/botController');
const botController = require('./controllers/botController');
const { startOptions, editOrderButtons } = require('./tg-options/options');

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
    const text = msg.text;
    const chatId = msg.chat.id;
    if(msg?.via_bot){ //если сообщение отправлено ботом от имени пользователя
        return;
    }
    if(text === '/start'){
        await bot.sendMessage(msg.chat.id, `Меню бота`, {

            reply_markup: {
                keyboard: [
                    [{text: '⭐️ Контакт', request_contact: true}]
                ],
                resize_keyboard: true
            }
    
        })
        // await bot.sendPhoto(chatId, './static/mainPhoto/startPhoto.jpeg')            
        // return await bot.sendMessage(chatId, `Добро пожаловать в домашнюю Мастерскую вкусных десертов Tsyganova's cakes🎂🧁`, startOptions)
    }
    if(text === '/myOrders'){
        botController.getOrders(bot, msg);   
        return; 
    }
    else {
        await bot.sendMessage(chatId, 'Упс!Я вас не понял 🙊');
        await bot.sendPhoto(chatId, './static/mainPhoto/instruction.png') 
        return await bot.sendMessage(chatId, `Нажмите на показанную выше кнопку, чтобы просмотреть мои команды `)
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
                return await bot.sendMessage(chatId, `Перейдите в корзину для редактирования заказа`, editOrderButtons)
            }
            orderController.creatingNewOrder(bot, msg);
        }
        catch(err){
            console.log(err)
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
    });

    bot.on('contact', async msg=> {

        try {
            console.log(msg);
            await bot.sendContact('808915653', msg.contact.phone_number, `Контакт`);
        }
        catch(error) {
            console.log(error);
        }
    })

