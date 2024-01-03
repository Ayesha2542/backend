const customReferences = require('../references/customReferences');

// cartSchema.js
const orderSchema = customReferences.mongoose.Schema({
  customer_id: {
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "customers",
},
  restaurant_id:{
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  totalAmount:String,
  deliveryFee:String,
  // Status:String,
  // isShared:String,
  isPurchased: { type: Number, default: 1 },
  
});

module.exports = orderSchema;
