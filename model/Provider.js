const customReferences = require ('../references/customReferences');
const providerSchema = customReferences.mongoose.Schema({
    "name":String,
    "email":String,
    "password":String,

});

module.exports = customReferences.mongoose.model('providers',providerSchema);