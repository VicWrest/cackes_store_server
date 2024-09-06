const { connectionManager } = require("../db/db");
const ApiError = require("../error/ApiError");
const { Type } = require("../models/models");

class Controller {
    async createNewType(req, res, next){
        try{
           const {name} = req.body;
        const type = await Type.create({name});
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
};

module.exports = new Controller();