const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, images, stock } = req.body;
    // ensure imageUrl fallback to first image for compatibility
    const firstImage = imageUrl || (Array.isArray(images) && images.length ? images[0] : '');
    const p = await Product.create({ name, price, category, description, imageUrl: firstImage, images: images || (firstImage ? [firstImage] : []), stock });
    res.status(201).json(p);
  } catch (err) {
    console.error('Product create error', err);
    res.status(500).json({ message: 'Create failed' });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;