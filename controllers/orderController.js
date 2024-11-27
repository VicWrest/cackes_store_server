const ApiError = require("../error/ApiError");
const basketService = require("../service/basketService");
const orderService = require("../service/orderService");
const { getUserByUsername } = require("../service/userService");
const { startOptions } = require("../tg-options/options");

class Controller {
    async createNewOrder(req, res, next){
        try{
            const user = req.user;
            const {queryId, chatId, products, date, summa, phone} = req.body;
            console.log(req.body)
            const bot = req.bot;
            const newOrder = await orderService.createNewOrder({date, summa, phone, userId: user.id, products});
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Подтверждение заказа',
                input_message_content: {
                    message_text: `Ваш заказ на сумму ${summa}, ${products.map(item => item.product.name).join(', ')}`
                }
            });
            await bot.sendMessage(chatId, `Все верно?`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [
                            {text: 'Да, оформить заказ', callback_data: JSON.stringify({type: 'order', answer: 'yes', orderId: newOrder.id})},
                            {text: 'Редактировать заказ', callback_data: JSON.stringify({type: 'order', answer: 'no', orderId: newOrder.id}), web_app: {url: process.env.FRONT_HOST + `/basket`}}
                        ]
                    ]
                })
            })
            return res.status(200).json({});
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при создании заказа"));
        }
    }

    async creatingNewOrder(chatId, data, userName){
        try{
            //need: 
            //user
            //data
            const {queryId, products, date, summa, phone} = req.body;
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Подтверждение заказа',
                input_message_content: {
                    message_text: `Ваш заказ на сумму ${summa}, ${products.map(item => item.title).join(', ')}`
                }
            })
            const order = await orderService.createNewOrder({userName, products, date, summa, phone});

            return res.status(200).json({});
        }
        catch(err){
            return new Error()
        }
    }

    async getAllOrders(userName){
        try{
            const user = req.user;
            const orders = await orderService.getAllOrders(userName)
            res.status(200).json(orders);
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    }
    async orderConfirm(bot, msg){
        try{
            const chatId = msg.message.chat.id;
            const userName = msg?.from?.username;
            const user = await getUserByUsername(userName);
            await basketService.deleteAllProducts({user});
            return await bot.sendMessage(chatId, `Благодарим Вас за заказ🎂🧁`)
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    };
    async orderCancell(bot, msg, data){
        try{
            const chatId = msg.chat.id;
            const userName = msg?.from?.username;
            const {orderId} = data;
            const allOrders = await orderService.getAllOrders(userName)
            console.log(allOrders)
            const deletedOrder = await orderService.deleteOrderById(orderId);
            allOrders = await orderService.getAllOrders(userName)
            console.log(`AFTER DELETED`, allOrders)
            return
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    };
};
module.exports = new Controller();