const uuid = require("uuid");
const path = require("path");
const { Product, Weight, ProductInfo, Basket, BasketProduct, Korzh } = require("../models/models");
const { beforeFindAfterExpandIncludeAll } = require("../db/db");

class Service {
    static async getResponse(basketModel) {

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
            const basket = await Basket.findOne({where: {userId: user.id}});
            return Service.getResponse(basket);
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    static async increment(data) {
        try{
            const {user, productId, korzhId, weightId} = data;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) return this.addProductInBasket(data)
            const checkProduct = await BasketProduct.findOne({where: {basketId: basket.id, productId, korzhId, weightId}});
            if(!checkProduct) await this.addProductInBasket(data); 
            await checkProduct.increment('quantity', {by: 1})
            const response = await Service.getResponse(basket);
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    static async decrement(data) {
        try{
            const {user, productId, korzhId, weightId} = data;
            let basket = await Basket.findOne({where: {userId: user.id}});
            if(!basket) return this.addProductInBasket(data)
            const checkProduct = await BasketProduct.findOne({where: {basketId: basket.id, productId, korzhId, weightId}});
            if(!checkProduct) await this.addProductInBasket(data); 
            await checkProduct.decrement('quantity', {by: 1});
            const response = await Service.getResponse(basket);
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
            const response = await Service.getResponse(basket);
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
}

module.exports = new Service();