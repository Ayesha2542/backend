const customReferences = require('../references/customReferences');

const restaurantSchema=require('../Schema/restaurantSchema');
module.exports =customReferences.mongoose.model('restaurants', restaurantSchema.restaurantSchema);
