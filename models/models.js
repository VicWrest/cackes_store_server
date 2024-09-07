const sequelize = require('../db/db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false},
    summa: {type: DataTypes.INTEGER, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const OrderItem = sequelize.define('order_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    productName: {type: DataTypes.STRING, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    weight: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    korzhName: {type: DataTypes.STRING, allowNull: false}
});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,}
})
const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false}
})
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    img: {type: DataTypes.STRING, allowNull: true},
    description: { type: DataTypes.TEXT, allowNull: true},
    shortdescription: { type: DataTypes.TEXT, allowNull: true}

})

const Korzh = sequelize.define('korzh', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Weight = sequelize.define('weight', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: true}
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


User.hasMany(Order, {
    onDelete: "CASCADE"
})
Order.belongsTo(User)

User.hasMany(Review, {
    onDelete: "CASCADE"
})
Review.belongsTo(User)

Order.hasMany(OrderItem, {
    onDelete: "CASCADE"
});
OrderItem.belongsTo(Order);

Basket.belongsToMany(Product, {
    onDelete: "CASCADE",
    through: BasketProduct});
Product.belongsToMany(Basket, {through: BasketProduct});

Type.hasMany(Product, {
    onDelete: "CASCADE"
})
Product.belongsTo(Type)

Product.hasMany(Weight, {
    onDelete: "CASCADE"
})
Weight.belongsTo(Product)

Korzh.hasMany(BasketProduct, {
    onDelete: "CASCADE"
})
BasketProduct.belongsTo(Korzh)

Product.hasMany(ProductInfo, {as: 'info',
        onDelete: "CASCADE"
});
ProductInfo.belongsTo(Product)

User.hasOne(Basket);

module.exports = {
    User,
    Order,
    OrderItem,
    Product,
    Type,
    Korzh,
    Review,
    ProductInfo, 
    Basket,
    BasketProduct,
    Weight
};