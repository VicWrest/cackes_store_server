const Router = require('express');
const { addProductInBasket, getProducts, deleteProductById, deleteAllProducts, increment, decrement} = require('../controllers/basketController');
const authMiddleware = require('../middleware/auth-middleware');

const router = new Router();

router.post("/", authMiddleware, addProductInBasket);
router.get("/", authMiddleware, getProducts);
router.put('/:productId/([0-9]+)/increment', increment)
router.put('/:productId([0-9]+)/decrement', decrement)
router.delete("/:id([0-9]+)", authMiddleware, deleteProductById)
router.delete("/", authMiddleware, deleteAllProducts);

module.exports = router;