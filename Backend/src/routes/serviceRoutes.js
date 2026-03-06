const express = require('express');
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public
router.get('/', serviceController.getAllServices);
router.get('/admin/all', protect, restrictTo('admin'), serviceController.getAllServicesAdmin);
router.get('/:id', serviceController.getServiceById);

// Admin
router.use(protect, restrictTo('admin'));
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
