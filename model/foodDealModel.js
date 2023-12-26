const customReferences = require('../references/customReferences');

const foodDealSchema=require('../Schema/foodDealSchema')
module.exports =customReferences.mongoose.model('foodDeals', foodDealSchema.foodDealSchema);
