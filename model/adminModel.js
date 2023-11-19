const customReferences = require('../references/customReferences');

const adminSchema=require('../Schema/adminSchema');
module.exports =customReferences.mongoose.model('admins', adminSchema.adminSchema);

