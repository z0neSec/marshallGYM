const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  email: String,
  notes: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customer: { type: CustomerSchema, required: true },
  items: { type: [ItemSchema], default: [] },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentRef: { type: String },
  status: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);