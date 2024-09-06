const Router = require('express');
const { createNewOrder, getAllOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth-middleware');

const router = new Router();

router.post("/", authMiddleware, createNewOrder);
router.get("/:username", authMiddleware, getAllOrders);

module.exports = router;