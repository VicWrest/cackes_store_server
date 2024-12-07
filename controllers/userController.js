const ApiError = require("../error/ApiError");
const userService = require("../service/userService");

class UserController {
    
    async login(req, res, next){
        try {
			const addedUser = await userService.login(req.body);
            console.log(`REGISTRATION`, addedUser)
			res.status(200).json(addedUser);
		}
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Ошибка создания товара"));
        }
    }
};

module.exports = new UserController();