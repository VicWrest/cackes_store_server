const Router = require('express');
const productController = require('../controllers/productController');
const checkRole = require('../middleware/checkRole');

const router = new Router();

router.post("/", checkRole, productController.createNewProduct);
router.post("/image", productController.uploadImg); //на клиенте не реализовано
router.get("/", productController.getAllProducts); 
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct); // не реализовано

module.exports = router;