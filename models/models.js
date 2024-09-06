const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false}
});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,}
})
const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER}
})
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: true}
})

const Korzh = sequelize.define('korzh', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    authorName: {type: DataTypes.STRING, defaultValue: "Пользователь предпочел скрыть свое имя"},
    rating: {type: DataTypes.INTEGER, allowNull: true},
    description: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: true}

})

const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

//расшифровка записи:
//модель user имеет одну модель order,
//модель order принадлежит модели user
User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Review)
Review.belongsTo(User)

Order.belongsToMany(Product, {through: OrderProduct});
Product.belongsToMany(Order, {through: OrderProduct});

Basket.belongsToMany(Product, {
    onDelete: "CASCADE",
    through: BasketProduct});
Product.belongsToMany(Basket, {through: BasketProduct});

BasketProduct

Type.hasMany(Product)
Product.belongsTo(Type)

Korzh.hasMany(Product)
Product.belongsTo(Korzh)

Korzh.hasMany(BasketProduct)
BasketProduct.belongsTo(Korzh)

Product.hasMany(ProductInfo, {as: 'info'});
ProductInfo.belongsTo(Product)

User.hasOne(Basket);

module.exports = {
    User,
    Order,
    OrderProduct,
    Product,
    Type,
    Korzh,
    Review,
    ProductInfo, 
    Basket,
    BasketProduct
};