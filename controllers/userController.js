const ApiError = require("../error/ApiError");
const { Review } = require("../models/models");
const { downloadImg } = require("../service/ReviewService");
const userService = require("../service/userService");

class UserController {
    
    async login(req, res, next){
        try {
            console.log(`START LOGIn`)
			const addedUser = await userService.login(req.body);
			res.status(200).json(addedUser);
		}
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка создания товара"));
        }
    }
};

module.exports = new UserController();