const { connectionManager } = require("../db/db");
const ApiError = require("../error/ApiError");
const { Type } = require("../models/models");
const productService = require("../service/productService");

class Controller {
    async createNewType(req, res, next){
        try{
            const {name} = req.body;
            const img = req.files?.img;
            const type = await Type.create({name});
            if(img) {
                const newType = await productService.downloadImg(type, img, `typesPhoto`);  
                return newType;
            }
            return res.json(type); 
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка добавления типа"));
        }
    }
    
    async getAllTypes(req, res, next){
        try{
            const types = await Type.findAll();
            res.status(200).json(types);
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Не удалось получить категории"));
        }
    }

    async deleteOneType(req, res, next){
        try{
            let {id} = req.params;
            console.log(req.params)
            const deletedType = await Type.destroy({where: {id: Number(id)}});
            const response = await Type.findAll();
            res.status(200).json(response);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при удалении коржа"))
        }
    }
};

module.exports = new Controller();