//создание кнопок в чате
require('dotenv').config();

module.exports = { 
    startOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: 'Выбрать дессерт', web_app: {url: process.env.FRONT_HOST}},
                    {text: 'Корзина', web_app: {url: process.env.FRONT_HOST + `/basket`}},
                    {text: 'Отзывы', web_app: {url: process.env.FRONT_HOST + `/review`}},
                ]
            ]
        })
    }

    // orderButtons: {
    //     reply_markup: JSON.stringify({
    //         inline_keyboard: [
    //             [
    //                 {text: 'Да, оформить заказ', callback_data: {answer: true, body: JSON.stringify(req.body)}},
    //                 {text: 'Редактировать заказ', web_app: {url: process.env.FRONT_HOST + `/basket`}}
    //             ]
    //         ]
    //     })
    // }

}