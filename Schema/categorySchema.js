const customReferences = require('../references/customReferences');

const categorySchema = customReferences.mongoose.Schema({
    title:String,
    categoryImage:String,
    
})
module.exports=categorySchema;