const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.post('/approve/:requestId', adminController.approveCreditRequest);
router.post('/reject/:requestId', adminController.rejectCreditRequest);
router.get('/daily-stats', adminController.getDailyStats);
router.get('/top-users', adminController.getTopUsers);

module.exports = router;