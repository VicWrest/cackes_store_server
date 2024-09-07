const Router = require('express');
const { createNewType, getAllTypes, deleteOneType } = require('../controllers/typeController');
const checkRole = require('../middleware/checkRole');

const router = new Router();

router.post("/", checkRole, createNewType);
router.get("/", getAllTypes);
router.delete("/:id([0-9]+)", checkRole, deleteOneType)

module.exports = router;