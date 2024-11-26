const ApiError = require("../error/ApiError");
const orderService = require("../service/orderService");

class Controller {
    async createNewOrder(req, res, next){
        try{
            const user = req.user;
            const {queryId, chatId, products, date, summa, phone} = req.body;
            console.log(req.body)
            const bot = req.bot;
            // const data = `${JSON.stringify({answer: true, body: req.body})}`
            const data = JSON.stringify({answer: true, body: 'body'})
            console.log(data, typeof data);
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
                            {text: 'Да, оформить заказ', callback_data: data},
                            {text: 'Редактировать заказ', web_app: {url: process.env.FRONT_HOST + `/basket`}}
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
};
module.exports = new Controller();