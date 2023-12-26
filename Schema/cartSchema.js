const customReferences = require('../references/customReferences');

const cartSchema = customReferences.mongoose.Schema({
    productName:String,
    productPrice:String,
    productImage:String,
    customer_id: {
        type: customReferences.mongoose.Schema.Types.ObjectId,
        ref: "customers",
      },
    
})
module.exports=cartSchema;