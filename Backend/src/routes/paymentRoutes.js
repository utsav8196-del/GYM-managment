const express = require('express');
// const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin', 'staff'));
// router.route('/').get(paymentController.getAll).post(paymentController.create);

module.exports = router;