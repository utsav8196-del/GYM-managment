const express = require('express');
// const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
// router.post('/', bookingController.createBooking); // member books
// router.put('/:id/cancel', bookingController.cancelBooking);
// router.put('/:id/attend', restrictTo('staff'), bookingController.markAttended);

module.exports = router;