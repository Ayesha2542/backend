const customReferences = require('../references/customReferences');

const notificationSchema=require('../Schema/notificationSchema');
module.exports =customReferences.mongoose.model("Notification", notificationSchema);
