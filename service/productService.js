const uuid = require("uuid");
const path = require("path");

const { Product } = require("../models/models");

class Service {
    async downloadImg(id, img) {
        const product = await Product.findOne({where: {id}});
        let fileName = uuid.v4() + ".jpg"
        img.mv(path.resolve(__dirname, '..', 'static/productsPhoto', fileName))
        const productId = product.dataValues.id
        const resProduct = await Product.update({
            img: fileName
        },
        {
            where: {
                id: productId
            },
            returning: true,//чтобы объект вернулся назад 
            plain: true //чтобы никакие метаданные не возращались за иключением самого объекта

        });
        return resProduct[1];
    }
}

module.exports = new Service();