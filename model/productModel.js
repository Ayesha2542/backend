const customReferences = require('../references/customReferences');

const productSchema=require('../Schema/productSchema');
module.exports =customReferences.mongoose.model('products', productSchema.productSchema);
