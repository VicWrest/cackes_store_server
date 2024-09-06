const Router = require('express');
const { createNewOrder, getAllOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth-middleware');
const checkRole = require('../middleware/checkRole');
const { createNewKorzh, getAllKorzhs, deleteOneKorzh } = require('../controllers/korzhController');

const router = new Router();

router.post("/", checkRole, createNewKorzh);
router.get("/", getAllKorzhs);
router.delete("/", deleteOneKorzh);

module.exports = router;