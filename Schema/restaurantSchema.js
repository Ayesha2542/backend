const customReferences = require('../references/customReferences');

const restaurantSchema = customReferences.mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  restuarantImage: String, 
  restaurantName: String,
  restaurantCNIC: String,
  restaurantphoneNumber:String,
  restaurantAddress:String,
  status:{type:Number,default:1} ,// Assuming this is the path to the profile image
  restaurant_id:{
    type:customReferences.mongoose.Schema.Types.ObjectId,
    
},



});

module.exports= {
     restaurantSchema :restaurantSchema
}