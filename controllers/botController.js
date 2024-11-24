const { startOptions } = require("../tg-options/options");
const { getAllOrders } = require("./orderController");
require('dotenv').config();

class Controller {
    async start(bot, msg){
        const chatId = msg.chat.id;
        try{
            //await bot.sendPhoto(chatId, '../static/mainPhoto/startPhoto.jpeg')            
            await bot.sendMessage(chatId, `Добро пожаловать в домашнюю Мастерскую вкусных десертов Tsyganova's cakes🎂🧁`, startOptions)
        }
        catch(err){
            console.log(err);
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
       
    }
    async getOrders(bot, msg){
        const chatId = msg.chat.id;
        try{
            const orders = await getAllOrders('username');
            //TO DO 
            //посмотреть какие данные будут приходить в order 
            //и вывести их
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Мои заказы',
                input_message_content: {
                    message_text: `Ваш заказ на сумму ${summa}, ${products.map(item => item.title).join(', ')}`
                }
            });
        }
        catch(err){
            console.log(err);
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
    }
    async getErrorAndInstruction(bot, msg){
        const chatId = msg.chat.id;
        try{
            await bot.sendMessage(chatId, 'Упс!Я вас не понял 🙊');
            await bot.sendPhoto(chatId, `СКРИН`) //TO DO
            await bot.sendMessage(chatId, `Нажмите на показанную выше кнопку, чтобы просмотреть мои команды `)
        }
        catch(err){
            console.log(err);
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
       
    }

    async creatingNewOrder(bot, msg){
        const chatId = msg.chat.id;
        try{
            const data = JSON.parse(msg.data); //то что указывается в options callback_data
            if(data.answer === true){
                //TO DO в функцию creatingNewOrder нeобходимо еще передать userName из tg
                await creatingNewOrder(chatId, data, 'username') 
                return;
            }
            else{
                throw new Error();
            }
        }
        catch(err){
            console.log(err);
            bot.sendMessage(chatId, 'Упс! Произошла серверная ошибка🙊');
            bot.sendMessage(chatId, 'Попробуйте запустить бот заново командой /start 🙃');
        }
       
    }
}

module.exports = new Controller();