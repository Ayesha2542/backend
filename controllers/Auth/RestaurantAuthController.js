const customReferences = require("../../references/customReferences");
const restaurantModel = require("../../model/restaurantModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const customerProfileUploadMW = require('../../MiddleWare/customerProfileUploadMW');
const restaurantPicMW = require("../../MiddleWare/restaurantPicMW.JS");

customReferences.app.post(
  "/restaurantSignup",
  restaurantPicMW("Restaurants").single("restuarantImage"),
  async (request, response) => {
    try {
      const { 
        userName, 
        userEmail, 
        userPassword, 
        restaurantName, 
        restaurantAddress, 
        restaurantCnic, 
        restaurantPhoneNumber, 
        
      } = request.body;

      console.log("Received data:", { 
        userName,
        userEmail,
        userPassword,
        restaurantName, 
        restaurantAddress, 
        restaurantCnic, 
        restaurantPhoneNumber, 
        screenType 
      });

      const existingUser = await restaurantModel.findOne({ email: email });

      if (existingUser) {
        return response.json({
          save: false,
          message: "A user with the same email already exists.",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      if (screenType === 'Signup') {
        // Handle signup data
        // Create a new user
        const newUser = await restaurantModel.create({
          userName: userName,
          userEmail: userEmail,
          userPassword: hashedPassword,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        if (savedUser) {
          response.send({ added: true, newUser: savedUser });
        } else {
          response.send({ added: false });
        }
      } else if (screenType === 'RestaurantDetail') {
        // Handle restaurantDetail data
        // Create a new restaurant
        const newRestaurant = await restaurantModel.create({

          restaurantName: restaurantName,
          restaurantCnic: restaurantCnic,
          restaurantPhoneNumber: restaurantPhoneNumber,
          restaurantAddress: restaurantAddress,
          restuarantImage: "/Restaurants/" + request.file.filename,
        });

        // Save the restaurant to the database
        const savedRestaurant = await newRestaurant.save();

        if (savedRestaurant) {
          response.send({ added: true, newRestaurant: savedRestaurant });
        } else {
          response.send({ added: false });
        }
      }

    } catch (error) {
      console.error(error);
      response.status(500).send({ added: false, error: error.message });
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
      const user = await restaurantModel.findOne({email:email}); 
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
    const { securityQuestions,_id, customerPhoneNumber } = req.body;
    const imgName = req.file.filename;
    const sq = JSON.parse(securityQuestions);

    try {
      const user = await restaurantModel.findOneAndUpdate(
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
console.log('registeredUser',user)
      if (user) {
        res.json({ message: "Data saved successfully" ,registeredUser:user});
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);



//++++++++++++++++++++++++forget password++++++++++++++++++++++++++++++++++++\

// Assume you have an express app instance
const app = customReferences.app;

app.post("/forgetPassword", formData.none(), async (request, response) => {
  try {
    const { email, firstSecurityAnswer, secondSecurityAnswer } = request.body;
    
    // Check if a user with the provided email exists
    const user = await restaurantModel.findOne({ email: email });

    if (!user) {
      return response.json({
        success: false,
        message: "User not found with the provided email.",
      });
    }

    // Check if security answers match
    if (
      user.securityQuestions[0].answer !== firstSecurityAnswer ||
      user.securityQuestions[1].answer !== secondSecurityAnswer
    ) {
      return response.json({
        success: false,
        message: "Security answers do not match.",
      });
    }

    // If everything is correct, send a success response
    response.json({
      success: true,
      message: "Security answers matched. Proceed to change password.",
    });
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});


customReferences.app.post("/viewAllCustomers", async (request, response) => {
  try {
    const users = await restaurantModel.find(); // Retrieve all Customers from MongoDB
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});

customReferences.app.delete("/deleteCustomer/:customerId", async (request, response) => {
  try {
    const { customerId } = request.params;

    // Find and delete the customer by ID
    const deletedCustomer = await restaurantModel.findByIdAndDelete(customerId);

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
    const user = await restaurantModel.findById(userId);

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






