const customReferences = require('../references/customReferences');
const moment = require('moment');
// cartSchema.js
const productSchema = customReferences.mongoose.Schema({
  productName: String,
  qty: Number,
  productPrice: String,
});

const orderSchema = customReferences.mongoose.Schema({
  customer_id: {
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "customers",
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  customerName: String,
  customerPhoneNumber: String,
  customerEmail: String,
  deliveryAddress: String,
  products: [productSchema],
  deliveryFee: String,
  totalAmount: String,
  orderDateTime: {
    type: String,
    default: moment().format('DD MMM HH:mm'), // Example: 28 Sep 19:05
  },
  restaurant_id: {
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  isPurchased: { type: Number, default: 1 },
  status: [{
    type: String,
    enum: ['New Order', 'Order in-Process', 'Order Delivered', 'Order Cancelled'],
    default: ['New Order'],
  }],
  // isShared:String,
});

module.exports = orderSchema;
