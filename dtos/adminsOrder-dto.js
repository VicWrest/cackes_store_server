const moment = require('moment-timezone')

module.exports = class Dto {
    orderId;
    date;
    summa;
    phone;
    create_order_date;
    user_name;
    products;
    constructor(model) {
        this.orderId = model.orderId;
        this.due_date= this.getDate(model.due_date);
        this.summa= model.summa;
        this.phone= model.phone;
        this.order_date= this.getDate(model.order_date);
        this.user_name= model.user_name;
        this.products = model.products;
    }
    getDate(date){
        const newYork = moment.tz(date, "America/New_York");
        const LA = newYork.clone().tz("America/Los_Angeles");
        console.log(newYork.format())
        console.log(`LA`, LA.format())
        const dat = new Date(date);
        const year = dat.getFullYear();
        const month = dat.getMonth() + 1;
        const day = dat.getDate();
        const hour = Number(dat.getHours()) + 10;
        const minutes = dat.getMinutes();
        const transformDate = `${day}/${month}/${year} ${hour}:${minutes}`
        return transformDate;
        
    }
    get messageForAdmin(){
        let mainMessage = 
            `номер заказа: ${this.orderId}
дата и время создания заказа:
${this.order_date}
сумма заказа: ${this.summa}
имя пользователя: @${this.user_name}
телефон для связи: ${this.phone}
необходимо выполнить к: 
${this.due_date}
сумма заказа: ${this.summa}

`
        for (const [index, product] of this.products.entries()){
            mainMessage +=
            `${index+1})название дессерта: ${product.productName}
вкус коржа: ${product.korzhName}
вес: ${product.weight}
количество: ${product.quantity}

`
        }
        return mainMessage;
    }
}