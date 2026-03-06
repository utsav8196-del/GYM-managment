const express = require('express');
const contactController = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public
router.post('/', contactController.createContact);

// Admin
router.use(protect, restrictTo('admin', 'staff'));
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;