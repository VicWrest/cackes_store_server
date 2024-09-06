const ApiErrors = require('../error/ApiError');
const authService = require('../service/userService');
const tokenService = require('../service/tokenService');

module.exports = async function(req, res, next) {
    try {
        const autorizationHeader = req.headers.authorization;
        if(!autorizationHeader) {
            return next(ApiErrors.UnavtorizedError())
        }
        const accessToken = autorizationHeader.split(' ')[1];
        if(!accessToken) {
            return next(ApiErrors.UnavtorizedError())
        }
        const validToken = await tokenService.validateAcessToken(accessToken);
	    const user = await authService.getUserByUsername(validToken.name) //находим пользователя в бд
        
        if(!validToken || !user) {   
            throw ApiErrors.UnavtorizedError();
        }
        req.user = validToken;
        next();
    }
    catch(e) {
        console.log(e);
        return next(ApiErrors.UnavtorizedError());
    }
}