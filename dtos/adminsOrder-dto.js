module.exports = class Dto {
    orderId;
    date;
    summa;
    phone;
    create_order_date;
    user_name;
    constructor(model) {
        this.orderId = model.orderId;
        this.due_date= this.getDate(model.due_date);
        this.summa= model.summa;
        this.phone= model.phone;
        this.order_date= this.getDate(model.order_date);
        this.user_name= model.user_name;
    }
    static getDate(date){
        const dat = new Date(date);
        const year = dat.getFullYear();
        const month = dat.getMonth()
        const day = dat.getDate();
        const hour = dat.getHours() 
        const minutes = dat.getMinutes();
        const transformDate = `${day}/${month}/${year} ${hour}:${minutes}`
        return transformDate;
        
    }
    get messageForAdmin(){
        const message = `номер заказа: ${this.orderId}
            дата и время создания заказа: ${this.order_date}
            дата и время создания заказа: ${this.order_date}
        `
    }
}