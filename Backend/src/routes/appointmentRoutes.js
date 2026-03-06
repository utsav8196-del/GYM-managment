const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public
router.post('/', appointmentController.createAppointment);

// Admin
router.use(protect, restrictTo('admin', 'staff'));
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;