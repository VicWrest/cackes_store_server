const uuid = require("uuid");
const path = require("path");
const { Product, Weight, ProductInfo, Basket, BasketProduct } = require("../models/models");

class Service {
    constructor(){

    } 
    static async getResponse(basketModel) {
        try{
            const basketProducts = await basketModel.getProducts({
                joinTableAttributes: ['id', 'quantity', 'productId', 'korzhId', 'weightId']
            })
            console.log(basketProducts)
            //добавляю массив с объектами вес-цена к каждому товару 
            //в корзине вручную
            const products = basketProducts.map(async product => {
                const weights = await Weight.findAll({where:{productId: product.basket_product.productId}, raw: true})
                return {...product.dataValues, weights}
            })
            const response = Promise.all(products)
            return response;
        }
        catch(err){
            console.log(err)
            return err;
        }
    }

    static async getProducts(user) {
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
            const [products] = await basket.addProducts(prodById);
            products.korzhId = korzhId;
            products.weightId = weightId;
            await products.save();
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