const customReferences = require('../references/customReferences');

const notificationSchema = customReferences.mongoose.Schema({
    title: String,
    body: String,
    userId: String,
    
})
module.exports=notificationSchema;