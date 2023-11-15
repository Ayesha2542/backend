const customReferences = require('../references/customReferences');

const customerSchema=require('../Schema/customerSchema');
module.exports =customReferences.mongoose.model('customers', customerSchema.customerSchema);

// module.exports={
//   CustomerModel:CustomerModel
// }

// const userSchema = customReferences.mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   profileImage: String, // Assuming this is the path to the profile image
//   securityQuestions: [
//     {
//       question: String, // The question for security
//       answer: String, // The answer to the security question
//     },
//   ],
//   phoneNumber:String,
// });

// module.exports = customReferences.mongoose.model('users', userSchema);
