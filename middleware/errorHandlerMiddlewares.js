const ApiError = require("../error/ApiError");

module.exports= function errorHandler (err, req, res, next) {
    console.log(err);
    if(err instanceof ApiError){
      return res.status(err.status).json(err.message);
    }
    return res.status(500).json(err.message)
  };