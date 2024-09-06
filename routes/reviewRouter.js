const Router = require('express');
const { createNewReview, getAllReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth-middleware');

const router = new Router();

router.post("/", auth, createNewReview);
router.get("/", getAllReviews);

module.exports = router;