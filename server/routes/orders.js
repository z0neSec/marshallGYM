const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

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

// Verify payment with Paystack and update order
router.post('/:id/verify', async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ message: 'Payment gateway not configured' });
    }
    const { id } = req.params;
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: 'Missing reference' });

    // Call Paystack verify endpoint using axios
    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const resp = await axios.get(url, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } });
    const data = resp.data;
    if (!data || data.status !== true) {
      // failed verification
      await Order.findByIdAndUpdate(id, { status: 'failed', paymentRef: reference });
      return res.status(400).json({ message: 'Payment not verified', data });
    }

    // verify success
    const verify = data.data;
    if (verify.status === 'success') {
      const order = await Order.findByIdAndUpdate(id, { status: 'paid', paymentRef: reference }, { new: true });
      return res.json({ ok: true, order });
    } else {
      await Order.findByIdAndUpdate(id, { status: 'failed', paymentRef: reference });
      return res.status(400).json({ message: 'Payment not successful', verify });
    }
  } catch (err) {
    console.error('Verify payment error', err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// (Optional) Admin: list orders (protected by auth middleware if needed)
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetch orders failed' });
  }
});

module.exports = router;