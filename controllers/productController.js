const ApiError = require("../error/ApiError");
const { Order, Product, ProductInfo, Korzh, Weight } = require("../models/models");

const productService = require("../service/productService");

class Controller{
    constructor(){

    };

    async createNewProduct(req, res, next){
        try{
            const img = req.files?.img;
            const product = await productService.createProduct(req.body);
            if(img) {
                const newProduct = await productService.downloadImg(product, img, 'productsPhoto');  
            }
            return res.json(product);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка создания товара"));
        }
        
    }
    
    async getAllProducts(req, res, next){
        try{
            const {typeId} = req.query;
            let products;
            if(typeId){
                products = await Product.findAll({where : {typeId}, include: Weight})
            }
            else{
                products = await Product.findAll({include: Weight})
            }
            return res.json(products);         
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка получения товара"));
    };
   };
   
   async getProductById(req, res, next){
        try{
        const {id} = req.params;
        const product = await Product.findOne({
            where : {id},
            include: [
                {model: ProductInfo, as: 'info'},
                {model: Weight, as: 'weights'}
            ]   
         })
            return res.json(product);         
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка получения товара"));
    };
   };
   //отдельная загрузка фото не реализована на фронте
   async uploadImg(req, res, next){
      try{
         const {id} = req.id;
         const img = req.files.img;
         if(!img) {
          next(ApiError.badRequest("Не удалось получить фото"))   
        }
        const product = await productService.downloadImg(product.dataValues.id, img);
        return res.json(product);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка создания товара"));
        }
        
    }
    async deleteProductById(req, res, next){
        try{
            const {productId, typeId} = req.query;
            const deletedProduct = await Product.destroy({where: {id: productId}});
            const products = await Product.findAll({where : {typeId}, include: Weight})
            return res.json(products);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка при удалении товара"));
        }

    }
};

module.exports = new Controller();