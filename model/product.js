const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  category:String,
  name: String,
  image: String,
  new_price: Number,
  old_price: Number,
});

const Collection = mongoose.model('Products', collectionSchema);

module.exports = {
  Collection
}
