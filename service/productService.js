const uuid = require("uuid");
const path = require("path");
const { Product, Weight, ProductInfo } = require("../models/models");

class Service {
    async createProduct(body) {
        try{
            let {name, typeId, description, shortdescription, info, weight} = body;
            const product = await Product.create({name, typeId, description, shortdescription});
            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                )
            }
            if (weight) {
                weight = JSON.parse(weight)
                weight.forEach(i =>
                    Weight.create({
                        value: i.title,
                        price: i.description,
                        productId: product.id
                    })
                )
            }
            return product   
        }
        catch(err){
            console.log(err)
            return err;
        }

    }

    async downloadImg(model, img, folderName) {
        try{
            let fileName = folderName + '/' + uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static/', fileName))
            model.img = fileName;
            model.save();
        }
        catch(err){
            console.log(err)
            return err;
        }

    }
}

module.exports = new Service();