const Router = require('express');
const { addProductInBasket, getProducts, deleteProductById, deleteAllProducts, increment, decrement, updateProduct} = require('../controllers/basketController');
const authMiddleware = require('../middleware/auth-middleware');

const router = new Router();

router.post("/", authMiddleware, addProductInBasket);
router.get("/", authMiddleware, getProducts);
router.put('/:productId([0-9]+)/update', authMiddleware, updateProduct)
router.put('/:productId([0-9]+)/increment', authMiddleware, increment)
router.put('/:productId([0-9]+)/decrement', authMiddleware, decrement)
router.delete("/:productId([0-9]+)", authMiddleware, deleteProductById)
router.delete("/", authMiddleware, deleteAllProducts);

module.exports = router;