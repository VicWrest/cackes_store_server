const ApiError = require("../error/ApiError");
const { Order, Product, User, OrderProduct } = require("../models/models");
const userService = require("../service/userService");
const userController = require("./userController");

class Controller {
    async createNewOrder(req, res, next){
        //username достал из боди, можно реализовать из middleware req.user
        const {userName, product} = req.body;
        let user = await User.findOne({where: {name: userName}})
        if(!user){
            next(ApiError.badRequest("Серверная ошибка при создании заказа"));
        };
        const order = await user.createOrder();
        const prod = await Product.findOne({where: {id: product.id}});
        const ord = await order.addProduct(prod);
        return res.json(ord);
    }
    async getAllOrders(req, res){
        const {username}= req.params;
        const user = await User.findOne({where: {name: username}});
        const orders = await user.getOrders({include: Product});
        res.status(200).json(orders);
    }
};
module.exports = new Controller();