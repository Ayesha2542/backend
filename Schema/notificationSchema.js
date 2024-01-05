const customReferences = require('../references/customReferences');

const notificationSchema = customReferences.mongoose.Schema({
    title: String,
    body: String,
    customer_id:{
        type:customReferences.mongoose.Schema.Types.ObjectId,
    },
    
})
module.exports=notificationSchema;