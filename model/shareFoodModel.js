const customReferences = require('../references/customReferences');

const shareFoodModel=require('../Schema/shareFoodSchema');
module.exports =customReferences.mongoose.model('shareFoods', shareFoodModel);