const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/request-credits', authController.authenticate, userController.requestCredits);
router.get('/check-credits', authController.authenticate, userController.checkCredits);

module.exports = router;