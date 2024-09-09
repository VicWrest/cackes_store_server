const { compareSync } = require("bcryptjs");
const ApiError = require("../error/ApiError");
const { Product, Basket, BasketProduct } = require("../models/models");
const { addProductInBasket, getProducts } = require("../service/basketService");


class Controller {
    async addProductInBasket(req, res, next){
        try{
            const user = req.user;
            const {productId, korzhId, weightId} = req.body;
            const addedProducts = await addProductInBasket({user, productId, korzhId, weightId});
            return res.json(addedProducts);
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при добавлении продукта в корзину"));
        }
    }
    
    async getProducts(req, res, next){
        try{
            const products = await getProducts(req.user)
            return res.status(200).json(products);
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