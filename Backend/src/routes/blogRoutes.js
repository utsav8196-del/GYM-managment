const express = require('express');
const blogController = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public
router.get('/', blogController.getAllPosts);
router.get('/:slug', blogController.getPostBySlug);

// Admin
router.use(protect, restrictTo('admin'));
router.post('/', upload.single('image'), blogController.createPost);
router.put('/:id', upload.single('image'), blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;