const ApiError = require("../error/ApiError");
const { Order, Product, ProductInfo, Korzh } = require("../models/models");

const productService = require("../service/productService");

class Controller{
    constructor(){

    };

    async createNewProduct(req, res, next){
        try{
            const {name, price, typeId, info} = req.body;
            const img = req.files?.img;
            const korzh = await Korzh.findAll({raw:true}); //raw - чтобы в ответе исключить метаданные
            //создаем в бд продукт с каждым типом кор 
            const products = await Promise.all(korzh.map(async el => {
                const product = await Product.create({name, price, typeId: 2, korzhId: el.id});
                if(img) {
                    const newProduct = await productService.downloadImg(product.dataValues.id, img);  
                    return newProduct;
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
                return product;
                })
            )    
            return res.json(products);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка создания товара"));
        }
        
    }
    
    async getAllProducts(req, res, next){
        try{
            const {typeId} = req.params;
            let products;
            if(typeId){
                products = await Product.findAll({where : {typeId}})
            }
            else{
                products = await Product.findAll({})
            }
            return res.json(products);         
        }
        catch(err){
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