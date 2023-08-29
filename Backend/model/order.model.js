const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },   
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }],  
    totalAmount: Number,
    date: {
        date: {
            type: String,
            default: () => moment().format('DD-MMM-YY')
        },
        time: {
            type: String,
            default: () => moment().format('h:mmA')
        }
    }
});

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = { OrderModel };
