const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');
const authController = require('../controllers/authController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', authController.authenticate, upload.single('document'), documentController.uploadDocument);
router.post('/match', authController.authenticate, documentController.matchDocuments);
router.post('/compare', authController.authenticate, upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 }
]), documentController.compareDocuments);

module.exports = router;