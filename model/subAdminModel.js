const customReferences = require('../references/customReferences');

const subAdminSchema=require('../Schema/subAdminSchema');
module.exports =customReferences.mongoose.model('subAdmins', subAdminSchema.subAdminSchema);

