const ApiError = require("../error/ApiError");
const { Order, Product, User, OrderProduct, Korzh } = require("../models/models");
const userService = require("../service/userService");
const userController = require("./userController");

class Controller {
    
    async getAllKorzhs(req, res, next){
        try{
            const korzhs = await Korzh.findAll();
            res.status(200).json(korzhs);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при создании коржа"))
        }
    }

    async createNewKorzh(req, res, next){
        try{
            let {korzhs} = req.body;
            korzhs = JSON.parse(korzhs)
            for(const korzh of korzhs){
                await Korzh.create({
                    name: korzh.name
                })
            }
            const response = await Korzh.findAll();
            res.status(200).json(response);
        }

        catch(err){
            console.log(err)
            next(ApiError.badRequest("Серверная ошибка при создании коржа"))
        }
    }

    async deleteOneKorzh(req, res, next){
        try{
            let {id} = req.query;
            const deletedKorzh = await Korzh.destroy({where: {id: Number(id)}});
            const response = await Korzh.findAll();
            res.status(200).json(response);
        }
        catch(err){
            next(ApiError.badRequest("Серверная ошибка при удалении коржа"))
        }
    }

};
module.exports = new Controller();