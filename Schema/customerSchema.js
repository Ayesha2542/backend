const customReferences = require('../references/customReferences');

const customerSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String, 
  status:{type:Number,default:1} ,// Assuming this is the path to the profile image
  securityQuestions: {
    type:Array
  },
  phoneNumber:String,
  user_id:{
    type:customReferences.mongoose.Schema.Types.ObjectId,
    
},



});

module.exports= {
     customerSchema :customerSchema
}