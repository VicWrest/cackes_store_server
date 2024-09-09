const Router = require('express');
const productController = require('../controllers/productController');
const checkRole = require('../middleware/checkRole');

const router = new Router();

router.post("/", checkRole, productController.createNewProduct);
router.post("/image", productController.uploadImg); //на клиенте не реализовано
router.get("/", productController.getAllProducts); 
router.get("/:id([0-9]+)", productController.getProductById);
router.delete("/", checkRole, productController.deleteProductById);

module.exports = router;