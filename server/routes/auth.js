const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// seed admin on startup if not exists (callable on server start)
async function seedAdmin() {
  try {
    const found = await User.findOne({ email: ADMIN_EMAIL });
    if (!found) {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({ email: ADMIN_EMAIL, passwordHash: hash });
      console.log('Admin seeded:', ADMIN_EMAIL);
    }
  } catch (err) {
    console.error('Admin seed failed', err);
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router, seedAdmin };