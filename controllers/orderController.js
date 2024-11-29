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
                            {text: 'Редактировать заказ', callback_data: JSON.stringify({type: 'order', answer: 'no', orderId: newOrder.id})}
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
    async orderConfirm(bot, msg, data){
        try{
            const chatId = msg.message.chat.id;
            const userName = msg?.from?.username;
            const {orderId} = data;
            const user = await getUserByUsername(userName);
            await basketService.deleteAllProducts({user});
            await bot.sendMessage(chatId, `Благодарим Вас за заказ🎂🧁`);
            await this.sendOrderAdmin(bot, orderId)
            // return await bot.sendMessage(1060390459, `Благодарим Вас за заказ🎂🧁`)
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    };
    async orderCancell(bot, msg, data){
        try{
            const chatId = msg.message.chat.id;
            const userName = msg?.from?.username;
            const {orderId} = data;
            const deletedOrder = await orderService.deleteOrderById(orderId);
            return 
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    };

    async sendOrderAdmin(bot, orderId){
        try{
           const order = orderService.getOrderById(orderId);
           console.log(`ORDER FOR ADMIN`, order)
            return 
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    };
};
module.exports = new Controller();