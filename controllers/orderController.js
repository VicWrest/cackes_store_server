const ApiError = require("../error/ApiError");
const orderService = require("../service/orderService");

class Controller {
    async createNewOrder(req, res, next){
        try{
            const user = req.user;
            const {products, date, summa, phone} = req.body;
            const order = await orderService.createNewOrder({user, products, date, summa, phone});
            return res.json(order);
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при создании заказа"));
        }
    }

    async getAllOrders(req, res, next){
        try{
            const user = req.user;
            const orders = await orderService.getAllOrders({user})
            res.status(200).json(orders);
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при получении заказов"));
        }

       
    }
};
module.exports = new Controller();