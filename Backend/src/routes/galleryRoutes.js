const express = require('express');
const galleryController = require('../controllers/galleryController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public
router.get('/', galleryController.getAllImages);

// Admin
router.use(protect, restrictTo('admin'));
router.post('/', upload.single('image'), galleryController.createImage);
router.put('/:id', upload.single('image'), galleryController.updateImage);
router.delete('/:id', galleryController.deleteImage);

module.exports = router;