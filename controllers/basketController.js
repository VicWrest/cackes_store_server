const ApiError = require("../error/ApiError");
const { Product, Basket, BasketProduct } = require("../models/models");


class Controller {
    //получаем с фронта productId, тип коржа, количество товара
    async addProductInBasket(req, res, next){
        try{
            const user = req.user;
        const {id} = req.body;
        //нет свзяи между user и basket
        let basket = await Basket.findOne({where: {userId: user.id}});
        if(!basket){
            basket = await Basket.create({userId: user.id});
        }
        const prodById = await Product.findOne({where: {id: id}});
        const userBasket = await basket.addProduct(prodById);
        return res.json(userBasket);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при добавлении продукта в корзину"));
        }
        //username достал из req.user, можно реализовать из req.body
        
    }
    
    async getProducts(req, res, next){
        try{
            const user = req.user;
            const basket = await Basket.findOne({where: {userId: user.id}, include: Product})
            return res.status(200).json(basket);
        }
        catch(err){
            next(ApiError.badRequest("Упс! Возникла ошибка при получении продуктов"));
        }
    }
    
    async deleteProductById(req, res, next){
        try{
            const productId = req.params.id;
            const user = req.user;
            const basket = await Basket.findOne({where: {userId: user.id}});
            const product = await Product.findOne({where: {id: productId}});
            if(!product){
                next(ApiError.badRequest("Серверная ошибка при удалении продукта"));
            }
            await basket.removeProduct(product);
            const updatedBasket = await Basket.findOne({where: {userId: user.id}, include: Product})
            return res.status(200).json(updatedBasket);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Серверная ошибка"));
        }
    }
    
    async deleteAllProducts(req, res, next){
        try{ 
            const user = req.user;
            const basket = await Basket.findOne({where: {userId: user.id}});
            await basket.destroy()
            return res.status(200).json(null);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при удалении продукта"));
        }
    }
    
};
module.exports = new Controller();