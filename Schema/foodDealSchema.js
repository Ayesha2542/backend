const customReferences = require("../references/customReferences");

const foodDealSchema = customReferences.mongoose.Schema({
  restaurant_id: {
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  foodDealTitle: String,
  // foodDealProductsName:String,
  foodDealDescription: String,
  foodDealPrice: String,
  foodDealImage: String,
  
  // foodDealDiscount:String,
});

module.exports = {
    foodDealSchema: foodDealSchema,
};
