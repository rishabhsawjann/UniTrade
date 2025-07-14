const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/Item');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Item.deleteMany({});
  console.log('All items deleted');
  process.exit();
}); 