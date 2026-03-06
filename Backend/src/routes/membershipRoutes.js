const express = require('express');
// const membershipController = require('../controllers/membershipController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin', 'staff'));
// router.route('/').get(membershipController.getAll).post(membershipController.create);
// etc.

module.exports = router;