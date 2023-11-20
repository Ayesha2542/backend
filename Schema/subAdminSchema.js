const customReferences = require('../references/customReferences');

const subAdminSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
 
});

module.exports= {
    subAdminSchema :subAdminSchema
}