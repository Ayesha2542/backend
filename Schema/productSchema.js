const customReferences = require("../references/customReferences");

const productSchema = customReferences.mongoose.Schema({
  restaurant_id: {
    type: customReferences.mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  categoryName: String,
  productName: String,
  productDescription: String,
  productPrice: String,
  productImage: String,
});

module.exports = {
  productSchema: productSchema,
};
