const express = require('express');
const memberController = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin', 'staff'));

router.route('/')
  .get(memberController.getAllMembers)
  .post(memberController.createMember);

router.route('/:id')
  .get(memberController.getMember)
  .put(memberController.updateMember)
  .delete(memberController.deleteMember);

module.exports = router;