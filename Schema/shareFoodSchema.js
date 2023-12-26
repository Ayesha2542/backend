const customReferences = require('../references/customReferences');

const shareFoodSchema = customReferences.mongoose.Schema({
    productName:String,
    productPrice:String,
    productImage:String,
    productDescription:String,
    productPricePerPerson:String,
    productSelectedDateAndTime:String,
    customer_id: {
        type: customReferences.mongoose.Schema.Types.ObjectId,
        ref: "customers",
      },
    
})
module.exports=shareFoodSchema;