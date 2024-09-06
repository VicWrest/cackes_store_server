const Router = require('express');
const { createNewType, getAllTypes } = require('../controllers/typeController');
const checkRole = require('../middleware/checkRole');

const router = new Router();

router.post("/", checkRole, createNewType);
router.get("/", getAllTypes);

module.exports = router;