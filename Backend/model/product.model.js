const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    brand:String,
    price: Number, 
    image: String,
    location: String,
    isActive: { type: Boolean, default: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = { ProductModel };
