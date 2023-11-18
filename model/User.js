const customReferences = require('../references/customReferences');

const userSchema = customReferences.mongoose.Schema({
    user_id:{
        type:customReferences.mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    "name": String,
    "email": String,
    "password": String,
    "status":{type:Number,default:1}
});

module.exports = customReferences.mongoose.model('users', userSchema);