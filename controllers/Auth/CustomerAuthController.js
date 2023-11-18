
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

customReferences.app.post("/viewAllCustomers", async (request, response) => {
  try {
    const users = await userModel.find(); // Retrieve all Customers from MongoDB
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});

customReferences.app.delete("/deleteCustomer/:customerId", async (request, response) => {
  try {
    const { customerId } = request.params;

    // Find and delete the customer by ID
    const deletedCustomer = await userModel.findByIdAndDelete(customerId);

    if (deletedCustomer) {
      response.json({ success: true, message: "Customer deleted successfully." });
    } else {
      response.json({ success: false, message: "Customer not found." });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});


customReferences.app.put("/toggleUserStatus/:userId", async (request, response) => {
  try {
    const { userId } = request.params;

    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({ success: false, message: "User not found." });
    }

    // Toggle the user status between 0 and 1
    user.status = user.status === 1 ? 0 : 1;

    // Save the updated user
    const updatedUser = await user.save();

    response.json({ success: true, message: "User status updated successfully.", updatedUser });
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});



customReferences.app.post("/adminLogin", formData.none(), async (request, response) => {
  try {
    const { email, password } = request.body;

    // Find the user by email
    const admin = await adminModel.findOne({ email });

    if (admin) {
      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      if (isPasswordMatch) {
        response.json({"match": true, "loggedInUser": admin});
      } else {
        response.json({"match": false});
      }
    } else {
      response.json({"match": false});
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});
