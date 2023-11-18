const customReferences = require('../references/customReferences');

const customerSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String, // Assuming this is the path to the profile image
  securityQuestions: {
    type:Array
  },
  phoneNumber:String,
});

module.exports= {
     customerSchema :customerSchema
}