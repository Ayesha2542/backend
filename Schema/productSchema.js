const customReferences = require('../references/customReferences');

const productSchema = customReferences.mongoose.Schema({
  title: String,
  description: String,
  price:String,
 
});

module.exports= {
     productSchema :productSchema
}