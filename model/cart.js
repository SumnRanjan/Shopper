const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 },
            image: String,
        },
    ],
    totalPrice: { type: Number, default: 0 },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
