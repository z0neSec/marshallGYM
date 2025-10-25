require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { router: authRouter, seedAdmin } = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter); // <--- added orders routes

// connect db & seed admin
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedAdmin();
  }).catch((e) => console.error('Mongo error', e));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));