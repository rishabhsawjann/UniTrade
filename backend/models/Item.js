const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  whatsapp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema); 