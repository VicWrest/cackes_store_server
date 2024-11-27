const uuid = require("uuid");
const path = require("path");
const basketService = require('./basketService');

const { Review, Order, OrderItem, User } = require("../models/models");

class Service {
    async createNewOrder(body){
        try{
            const {date, summa, phone, userId} = body;
            let {products} = body;
            if(!products) return new Error('Ваша корзина пуста');
            const user = await User.findOne({where: {id: userId}})
            if(!user) throw new Error();
            const order = await Order.create({date, summa, phone, userId: user.id});
            for(const i of products){
               await OrderItem.create({
                    productName: i.product.name,
                    quantity: i.quantity,
                    weight: i.weight.value,
                    price: i.weight.price,
                    korzhName: i.korzh.name,
                    orderId: order.id
                })
            }
            
            const response = await Order.findOne({where: {id: order.id}, include: OrderItem});
            return response;
        }
        catch(err){
            console.log(err)
            return new Error(`Серверная ошибка при создании заказа`);
        }
        
    }

    async getAllOrders(userName){
        try{
            const userInDB = await User.findOne({where: {name: userName}});
            //возможно нужго будет изменить include
            const orders = await userInDB.getOrders({include: OrderItem});
            return orders;
        }
        catch(err){
            return new Error();
        }
    }

    async deleteOrderById(orderId){
        try{
            // const deletedOrder = await Order.destroy({where: {id: orderId}});
            const deletedAllOrders = await Order.destroy({where: {userId: 2}, force: true});
            console.log(deletedAllOrders);
            return;
        }
        catch(err){
            console.log(err)
            return new Error();
        }
    }
}

module.exports = new Service();