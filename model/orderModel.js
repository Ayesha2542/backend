const customReferences = require('../references/customReferences');

const orderSchema=require('../Schema/orderSchema');
module.exports =customReferences.mongoose.model('orders', orderSchema);