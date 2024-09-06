const uuid = require("uuid");
const path = require("path");

const { Review } = require("../models/models");

class Service {
    async downloadImg(id, img) {
        const review = await Review.findOne({where: {id}});
        let fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, '..', 'static/reviewsPhoto', fileName))
        const reviewId = review.dataValues.id;
        const resReview = await Review.update({
            img: fileName
        },
        {
            where: {
                id: reviewId
            },
            returning: true,//чтобы объект вернулся назад 
            plain: true //чтобы никакие метаданные не возращались за иключением самого объекта

        });
        return resReview[1];
    }
}

module.exports = new Service();