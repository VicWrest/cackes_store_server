const ApiError = require("../error/ApiError");
const { Order, Product, ProductInfo, Korzh, Weight } = require("../models/models");

const productService = require("../service/productService");

class Controller{
    constructor(){

    };

    async createNewProduct(req, res, next){
        try{
            let {name, typeId, description, shortdescription, info, weight} = req.body;
            const img = req.files?.img;
            console.log(weight)
            const product = await Product.create({name, typeId, description, shortdescription})
            if(img) {
                const newProduct = await productService.downloadImg(product, img, 'productsPhoto');  
            }    
            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                )
            }
            if (weight) {
                weight = JSON.parse(weight)
                weight.forEach(i =>
                    Weight.create({
                        value: i.title,
                        price: i.description,
                        productId: product.id
                    })
                )
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
       include: [{model: ProductInfo, as: 'info'}]
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
    async deleteProduct(req, res, next){
        //TO DO
    }
};

module.exports = new Controller();