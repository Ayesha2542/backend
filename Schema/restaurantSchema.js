const customReferences = require('../references/customReferences');

const restaurantSchema = customReferences.mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  restaurantImage: String, 
  restaurantName: String,
  restaurantCnic: String,
  restaurantPhoneNumber:String,
  restaurantAddress:String,
  restaurantCategories:{
    type:Array
  },
  status:{type:Number,default:1} ,// Assuming this is the path to the profile image
  restaurant_id:{
    type:customReferences.mongoose.Schema.Types.ObjectId,
    
},



});

module.exports= {
     restaurantSchema :restaurantSchema
}