const express = require('express');
// const userController = require('../controllers/userController'); // create if needed
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Placeholder – add your own user routes later
router.use(protect, restrictTo('admin'));
// router.route('/').get(userController.getAllUsers).post(userController.createUser);
// etc.

module.exports = router;