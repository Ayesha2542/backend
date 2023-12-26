const customReferences = require('../references/customReferences');

const cartSchema=require('../Schema/cartSchema');
module.exports =customReferences.mongoose.model('carts', cartSchema);