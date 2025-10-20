const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, stock } = req.body;
    const p = await Product.create({ name, price, category, description, imageUrl, stock });
    res.status(201).json(p);
  } catch (err) {
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