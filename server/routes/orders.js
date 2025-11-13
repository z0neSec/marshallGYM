const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const BANK_NAME = process.env.BANK_NAME;
const BANK_ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME;
const BANK_ACCOUNT_NUMBER = process.env.BANK_ACCOUNT_NUMBER;

// Create order (pending)
router.post('/', async (req, res) => {
  try {
    const { customer, items, subtotal, total } = req.body;
    if (!customer || !items || !Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid order payload' });
    }
    const order = await Order.create({
      customer,
      items,
      subtotal,
      total,
      status: 'pending',
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error', err);
    res.status(500).json({ message: 'Create order failed' });
  }
});

// Admin list orders (protected) — MUST come before /:id
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetch orders failed' });
  }
});

// Get bank details (public)
router.get('/bank/details', (req, res) => {
  res.json({
    bankName: BANK_NAME,
    accountName: BANK_ACCOUNT_NAME,
    accountNumber: BANK_ACCOUNT_NUMBER,
  });
});

// Public get order by id (used for order complete page)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Fetch order error', err);
    res.status(500).json({ message: 'Fetch order failed' });
  }
});

// Mark order as paid (bank transfer confirmation)
router.post('/:id/confirm-payment', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: 'paid' }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ ok: true, order });
  } catch (err) {
    console.error('Confirm payment error', err);
    res.status(500).json({ message: 'Confirmation failed' });
  }
});

module.exports = router;