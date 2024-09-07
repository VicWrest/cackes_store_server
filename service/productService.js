const uuid = require("uuid");
const path = require("path");

//крайнее: сделал универсальную функцию для загрузки фоток
//попробовал только на типах фотку сохраняет, но на сайте не воспроизводит
class Service {
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