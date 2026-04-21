const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

router.post('/image', protect, upload.single('file'), uploadController.uploadImage);
router.post('/video', protect, upload.single('file'), uploadController.uploadVideo);

module.exports = router;