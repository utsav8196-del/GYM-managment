const express = require('express');
// const classController = require('../controllers/classController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public
// router.get('/', classController.getAllClasses);
// router.get('/:id', classController.getClass);

// Admin
router.use(protect, restrictTo('admin'));
// router.post('/', classController.createClass);
// etc.

module.exports = router;