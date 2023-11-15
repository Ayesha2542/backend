
const customReferences = require("../../references/customReferences");
const customerModel=require("../../model/CustomerModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const customerProfileUploadMW=require('../../MiddleWare/customerProfileUploadMW')

customReferences.app.post(
  "/signup",
  formData.none(),
  async (request, response) => {
    try {
      const { name, email, password } = request.body;
      console.log("Received data:", { name, email, password });
      
      // Check if a user with the same email already exists
      const existingUser = await customerModel.findOne({ email:email });
      console.log('check if user exists',existingUser);

      if (existingUser) {
        return response.json({
          save: false,
          message: "A user with the same email already exists.",
        });
      }
      console.log('check if user exists',existingUser);//kuch likha tha many dekha nai?

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new customerModel({
        name,
        email,
        // password
        password: hashedPassword,
      });

      // Save the user to the database
      const res = await newUser.save();
// console.log('user saved or not')
      if (res) {
        response.json({ save: true, message: "User registered successfully.",newUser:res });
      } else {
        response.json({ save: false, message: "Failed to register user." });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);

customReferences.app.post(
  "/login",
  formData.none(),
  async (request, response) => {
    try {
      const { email, password } = request.body;
console.log("lodin req email",email)
console.log("lodin req pass",password)
   // Find the user by emai
      const user = await customerModel.findOne({email:email}); 
console.log("user",user)
      if (user) {
        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
          response.json({ match: true, loggedInUser: user });
        } else {
          response.json({ match: false });
        }
      } else {
        response.json({ match: false });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);
// ********************************upload profile and security questions******************************************



// Route to save security questions and uploaded profile image
customReferences.app.post(
  "/uploadProfile",
  customerProfileUploadMW,
  async (req, res) => {
    console.log("profileData", req.body);
    console.log("profileData", req.body);
    const { securityQuestions,_id, customerPhoneNumber } = req.body;
    const imgName = req.file.filename;
    const sq = JSON.parse(securityQuestions);

    try {
      const user = await customerModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            profileImage: `/customerProfiles/${imgName}`,
            securityQuestions: sq,
            phoneNumber:customerPhoneNumber
          },
        },
        { new: true }
      );

      if (user) {
        res.json({ message: "Data saved successfully" });
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
