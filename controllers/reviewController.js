const ApiError = require("../error/ApiError");
const { Review } = require("../models/models");
const { downloadImg } = require("../service/ReviewService");

class Controller {
    async createNewReview(req, res, next){
        try{
            const user = req.user;
            const {authorName, rating, description} = req.body;
            const img = req.files?.img;
            const review = await Review.create({authorName, rating, description, userId: user.id});
            console.log(img)
            if(img){
                const newReview = await downloadImg(review.dataValues.id, img);
                return res.json(newReview);
            }
            return res.json(review); 
        }
        catch(err){
            console.log(err);
            next(ApiError.badRequest("Серверная ошибка при написании отзыва"));
        }
        
    }
    
    async getAllReviews(req, res, next){
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    }
};

module.exports = new Controller();