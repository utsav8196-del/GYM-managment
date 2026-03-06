const express = require('express');
// const trainerController = require('../controllers/trainerController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public routes (if any)
// router.get('/', trainerController.getAllTrainers);

// Admin only
router.use(protect, restrictTo('admin'));
// router.route('/').post(trainerController.createTrainer);
// etc.

module.exports = router;