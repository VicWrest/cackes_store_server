const Router = require('express');
const { addProductInBasket, getProducts, deleteProductById, deleteAllProducts} = require('../controllers/basketController');
const authMiddleware = require('../middleware/auth-middleware');

const router = new Router();

router.post("/", authMiddleware, addProductInBasket);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, deleteProductById)
router.delete("/", authMiddleware, deleteAllProducts);

module.exports = router;