const customReferences = require('../references/customReferences');

const adminSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
  password: String,
 
});

module.exports= {
     adminSchema :adminSchema
}