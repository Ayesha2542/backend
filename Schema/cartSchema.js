const customReferences = require('../references/customReferences');

// cartSchema.js
const cartSchema = customReferences.mongoose.Schema({
  productId:{
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  restaurant_id:{
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  productName: String,
  productPrice: String,
  productImage: String,
  isPurchased: { type: Number, default: 0 },
  pricePerProduct: { type: Number, required: true },
  qty: { type: Number, default: 1 }, // Quantity field
  customer_id: {
      type: customReferences.mongoose.Schema.Types.ObjectId,
      ref: "customers",
  },
});

module.exports = cartSchema;
