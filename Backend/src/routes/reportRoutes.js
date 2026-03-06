const express = require('express');
// const reportController = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));
// router.get('/revenue', reportController.getRevenue);
// router.get('/attendance', reportController.getAttendanceStats);
// router.get('/members', reportController.getMemberStats);

module.exports = router;