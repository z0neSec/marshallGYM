const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'marshall_gym',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const parser = multer({ storage });

router.post('/', parser.single('image'), (req, res) => {
  if (!req.file || !req.file.path) return res.status(400).json({ message: 'No file uploaded' });
  return res.json({ url: req.file.path });
});

module.exports = router;