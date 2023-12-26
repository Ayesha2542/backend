const customReferences = require('../references/customReferences');

const donorSchema=require('../Schema/donorSchema');
module.exports =customReferences.mongoose.model('donors', donorSchema.donorSchema);