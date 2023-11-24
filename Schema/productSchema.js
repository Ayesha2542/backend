const customReferences = require('../references/customReferences');

const productSchema = customReferences.mongoose.Schema({
  title: String,
  description: String,
  price:String,
  productImage: String, 

});

module.exports= {
     productSchema :productSchema
}