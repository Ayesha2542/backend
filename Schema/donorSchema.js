const customReferences = require('../references/customReferences');

// const addressSchema = customReferences.mongoose.Schema({
//   formattedAddress:String,
//   streetName: String,
//   elaqa: String,
//   locality: String,
//   label:String,
//   // Add other fields for the address as needed
// });
const donorSchema = customReferences.mongoose.Schema({
  donorName: String,
  foodDetails: String,
  distributionLocation: String,
  distributionDateTime: String, 

//   addresses: [addressSchema], // Use the address schema for the array
  donorPhoneNumber:String,
  userId: String, // Add this field
  // user_id:{
  //   type:customReferences.mongoose.Schema.Types.ObjectId,
    
// },



});

module.exports= {
     
  donorSchema :donorSchema
}