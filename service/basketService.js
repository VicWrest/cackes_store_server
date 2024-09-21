const uuid = require("uuid");
const path = require("path");
const { Product, Weight, ProductInfo, Basket, BasketProduct, Korzh } = require("../models/models");
const { where } = require("sequelize");

class Service {
    async getResponse(basketModel) {
        try{
            const basketProducts = await BasketProduct.findAll({where: {
                basketId: basketModel.id},
                include: [
                    {model: Weight, as: 'weight'}, 
                    {model: Korzh, as: 'korzh'}, 
                    {model: Product, as: 'product', include: Weight}
                ] 
            });
            return basketProducts;
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    async getProducts(user) {
        try{
            let basket = null;
            basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) basket = await Basket.create({userId: user.id});
            return await this.getResponse(basket);
        }
        catch(err){
            console.log(err)
            return err;
        }
    }
    
    async updateProduct(body){
        try{ 
            const {user, basketProductId, korzhId, weightId} = body;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(korzhId && weightId){
                const product = await BasketProduct.update({korzhId, weightId}, {where: {id: basketProductId}})
                console.log(product)
            }
            if(!korzhId && weightId){
                const product = await BasketProduct.update({weightId}, {where: {id: basketProductId}})
            }
            if(korzhId && !weightId){
                const product = await BasketProduct.update({korzhId}, {where: {id: basketProductId}})
            }
            if(!korzhId && !weightId){
                return new Error('не указаны korzhId и weightId');
            }
            const products = await this.getResponse(basket);
            return products;
        }
        catch(err){
            return new Error();
        }
    }

    async increment(data) {
        try{
            const {user, productId, korzhId, weightId} = data;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) return this.addProductInBasket(data);  
            const checkProduct = await BasketProduct.findOne({where: {basketId: basket.id, id: productId, korzhId, weightId}});
            if(!checkProduct) return await this.addProductInBasket(data); 
            await checkProduct.increment('quantity', {by: 1})
            const response = await this.getResponse(basket);
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    async decrement(data) {
        try{
            const {user, productId, korzhId, weightId} = data;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) return this.addProductInBasket(data)
            const checkProduct = await BasketProduct.findOne({where: {basketId: basket.id, id: productId, korzhId, weightId}});
            if(!checkProduct) await this.addProductInBasket(data); 
            await checkProduct.decrement('quantity', {by: 1});
            const response = await this.getResponse(basket);
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }
    }
    async addProductInBasket(data) {
        try{
            const {user, productId, korzhId, weightId} = data;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) {
                basket = await Basket.create({userId: user.id});
            }
            const checkProduct = await BasketProduct.findOne({where: {basketId: basket.id, productId, korzhId, weightId}});
            if(checkProduct) {
                return Service.increment(data)
            }
            const prodById = await Product.findOne({where: {id: productId}});
            const products = await BasketProduct.create({basketId: basket.id, productId: prodById.id, weightId, korzhId});
            const response = await this.getResponse(basket);
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }

    }

    async deleteProductById(data) {
        try{
            const {user, productId} = data;
            const basket = await Basket.findOne({where: {userId: user.id}});
            const deletedProduct = await BasketProduct.destroy({where: {id: productId}})
            if(!deletedProduct){
                next(ApiError.badRequest("Серверная ошибка при удалении продукта"));
            }
            const response = await this.getResponse(basket);
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }

    }

    async downloadImg(model, img, folderName) {
        try{
            let fileName = folderName + '/' + uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static/', fileName))
            model.img = fileName;
            model.save();
        }
        catch(err){
            console.log(err)
            return err;
        }

    }

    async deleteAllProducts(body){
        try{ 
            const {user} = body;
            const basket = await Basket.findOne({where: {userId: user.id}});
            await basket.destroy();
            const products = await this.getResponse(basket);
            return products;
        }
        catch(err){
            return new Error();
        }
    }
}

module.exports = new Service();