const express = require('express');
const courseController = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public
router.get('/', courseController.getAllCourses);

// Admin
router.use(protect, restrictTo('admin'));
router.post('/', upload.single('image'), courseController.createCourse);
router.put('/:id', upload.single('image'), courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;