const customReferences = require('../references/customReferences');

const subAdminSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
  status:{type:Number,default:1} ,// Assuming this is the path to the profile image
  subAdmin_id:{
    type:customReferences.mongoose.Schema.Types.ObjectId,
  }
});

module.exports= {
    subAdminSchema :subAdminSchema
}