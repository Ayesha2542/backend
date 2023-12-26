const customReferences = require('../references/customReferences');

const addressSchema = customReferences.mongoose.Schema({
  formattedAddress:String,
  streetName: String,
  elaqa: String,
  locality: String,
  label:String,
  // Add other fields for the address as needed
});
const customerSchema = customReferences.mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: String, 
  status:{type:Number,default:1} ,// Assuming this is the path to the profile image
  securityQuestions: {
    type:Array
  },
  // addresses:{
  //   type:Array
  // },
  addresses: [addressSchema], // Use the address schema for the array
  phoneNumber:String,
  user_id:{
    type:customReferences.mongoose.Schema.Types.ObjectId,
    
},



});

module.exports= {
     
  customerSchema :customerSchema
}