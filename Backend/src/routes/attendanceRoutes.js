const express = require('express');
// const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin', 'staff'));
// router.post('/checkin', attendanceController.checkIn);
// router.put('/checkout/:id', attendanceController.checkOut);
// router.get('/', attendanceController.getAll);

module.exports = router;