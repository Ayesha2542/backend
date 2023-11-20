const customReferences = require('../references/customReferences');

const categorySchema=require('../Schema/categorySchema');
module.exports =customReferences.mongoose.model('categories', categorySchema);