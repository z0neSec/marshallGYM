const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const BANK_NAME = process.env.BANK_NAME;
const BANK_ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME;
const BANK_ACCOUNT_NUMBER = process.env.BANK_ACCOUNT_NUMBER;

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

const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetch orders failed' });
  }
});

router.get('/bank/details', (req, res) => {
  res.json({
    bankName: BANK_NAME,
    accountName: BANK_ACCOUNT_NAME,
    accountNumber: BANK_ACCOUNT_NUMBER,
  });
});

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

router.post('/:id/confirm-payment', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ ok: true, order, message: 'Payment confirmation received. Admin will verify and mark as paid.' });
  } catch (err) {
    console.error('Confirm payment error', err);
    res.status(500).json({ message: 'Confirmation failed' });
  }
});

module.exports = router;