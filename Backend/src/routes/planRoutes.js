const express = require('express');
const planController = require('../controllers/planController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlan);

// Admin
router.get('/admin/all', protect, restrictTo('admin'), planController.getAllPlansAdmin);
router.post('/', protect, restrictTo('admin'), planController.createPlan);
router.put('/:id', protect, restrictTo('admin'), planController.updatePlan);
router.delete('/:id', protect, restrictTo('admin'), planController.deletePlan);

module.exports = router;