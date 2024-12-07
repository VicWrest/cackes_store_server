const ApiError = require("../error/ApiError");
const Service = require('../service/basketService')

class Controller {
    async addProductInBasket(req, res, next){
        try{
            const user = req.user;
            const {productId, korzhId, weightId} = req.body;
            const addedProducts = await Service.addProductInBasket({user, productId, korzhId, weightId});
            console.log(`ADD PRODUCT_IN_BASKET`, addedProducts)
            return res.json(addedProducts);
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при добавлении продукта в корзину"));
        }
    }
    
    async getProducts(req, res, next){
        try{
            const products = await Service.getProducts(req.user);
            console.log(`GET PRODUCT_IN_BASKET`, products)
            return res.status(200).json(products);
        }
        catch(err){
            console.log(err)
            next(ApiError.badRequest("Упс! Возникла ошибка при получении продуктов"));
        }
    }
    
    async deleteProductById(req, res, next){
        try{
            const productId = req.params.productId;
            const user = req.user;
            const products = await Service.deleteProductById({user, productId})
            return res.status(200).json(products);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Серверная ошибка"));
        }
    }
    async updateProduct(req, res, next){
        try{
            const user = req.user;
            const basketProductId = req.params.productId;
            const {korzhId, weightId} = req.body;
            const products = await Service.updateProduct({user, basketProductId, korzhId, weightId});
            return res.status(200).json(products);
        }
        catch(err){
            next(ApiError.badRequest("Упс! Возникла ошибка при обновлении продуктов в корзине"));
        }
    }

    async increment(req, res, next){
        try{ 
            const user = req.user;
            const {productId} = req.params;
            const {weightId, korzhId} = req.body;
            const products = await Service.increment({user, productId, weightId, korzhId});
            return res.status(200).json(products);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Серверная ошибка при увеличении количества товара"));
        }
    }

    async decrement(req, res, next){
        try{ 
            const user = req.user;
            const {productId} = req.params;
            const {weightId, korzhId} = req.body;
            const products = await Service.decrement({user, productId, weightId, korzhId});
            return res.status(200).json(products);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Серверная ошибка при увеличении количества товара"));
        }
    }


    async deleteAllProducts(req, res, next){
        try{ 
            const user = req.user;
            const products = await Service.deleteAllProducts(user)
            return res.status(200).json(products);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при удалении продукта"));
        }
    }
    
};
module.exports = new Controller();