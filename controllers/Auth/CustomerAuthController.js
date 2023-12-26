const customReferences = require("../../references/customReferences");
const customerModel = require("../../model/CustomerModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const customerProfileUploadMW = require("../../MiddleWare/customerProfileUploadMW");


// 
customReferences.app.post(
  "/signup",
  formData.none(),
  async (request, response) => {
    try {
      const { name, email, password } = request.body;
      console.log("Received data:", { name, email, password });

      // Check if a user with the same email already exists
      const existingUser = await customerModel.findOne({ email: email });
      console.log("check if user exists", existingUser);

      if (existingUser) {
        return response.json({
          save: false,
          message: "A user with the same email already exists.",
        });
      }
      console.log("check if user exists", existingUser); //kuch likha tha many dekha nai?

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
        response.json({
          save: true,
          message: "User registered successfully.",
          newUser: res,
        });
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
      console.log("lodin req email", email);
      console.log("lodin req pass", password);
      // Find the user by emai
      const user = await customerModel.findOne({ email: email });
      console.log("user", user);
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
    const { securityQuestions, _id, customerPhoneNumber } = req.body;
    const imgName = req.file.filename;
    const sq = JSON.parse(securityQuestions);

    try {
      const user = await customerModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            profileImage: `/customerProfiles/${imgName}`,
            securityQuestions: sq,
            phoneNumber: customerPhoneNumber,
          },
        },
        { new: true }
      );
      console.log("registeredUser", user);
      if (user) {
        res.json({ message: "Data saved successfully", registeredUser: user });
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//========================update customer profile=======================

customReferences.app.post(
  "/updateCustomerProfile",
  formData.none(),
  // customerProfileUploadMW,
  async (req, res) => {
    console.log("profileData", req.body);
    const { customerName, customerEmail, _id, customerPhoneNumber } = req.body;
    // const imgName = req.file.filename;

    try {
      const user = await customerModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            name: customerName,
            // email:customerEmail,
            // profileImage: `/customerProfiles/${imgName}`,
            phoneNumber: customerPhoneNumber,
          },
        },
        { new: true }
      );
      console.log("updatedUser", user);
      if (user) {
        res.json({ message: "Data saved successfully", updatedUser: user });
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//========================update customer profile image=======================

customReferences.app.post(
  "/updateCustomerProfileImage",
  // formData.none(),
  customerProfileUploadMW,
  async (req, res) => {
    console.log("profileData to update image", req.body);
    const imgName = req.file.filename;
    const { _id } = req.body;

    try {
      const user = await customerModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            profileImage: `/customerProfiles/${imgName}`,
          },
        },
        { new: true }
      );
      console.log("updatedUser", user);
      if (user) {
        res.json({ message: "Data saved successfully", updatedUser: user });
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//++++++++++++++++++++++++forget password++++++++++++++++++++++++++++++++++++\

customReferences.app.post(
  "/forgetPassword",
  formData.none(),
  async (req, res) => {
    console.log(req.body);
    console.log("signupsq req", JSON.parse(req.body.securityQuestions));
    try {
      const providedAnswers = await JSON.parse(req.body.securityQuestions);

      const result = await customerModel.findOne({ email: req.body.email });

      if (!result) {
        return res.json({ matched: false, error: "User not found" });
      } else {
        const storedAnswers = result.securityQuestions;
        console.log("storedAnswer", storedAnswers);
        const isAnswersMatching = storedAnswers.every((stored, index) => {
          return (
            stored.question === providedAnswers[index].question &&
            stored.answer === providedAnswers[index].answer
          );
        });
        console.log(isAnswersMatching);

        if (isAnswersMatching) {
          // Answers match, proceed with password reset or other actions
          res.json({ matched: true, newUser: result });
        } else {
          // Answers do not match
          res.json({ matched: false, newUser: result });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ matched: false, error: "An error occurred" });
    }
  }
);

//**************************reset password ****************************/
customReferences.app.post(
  "/resetPassword",
  formData.none(),
  async (req, res) => {
    console.log("resetPassword", req.body);
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await customerModel.findOne({
        email: req.body.email,
      });
      console.log("existuserchngepswrd", existingUser);
      if (!existingUser) {
        return res.json({
          login: false,
          message: "This user is not available.",
        });
      } else {
        const user = await customerModel.findOneAndUpdate(
          { email },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        console.log("chngepassword", user);
        if (!user) {
          return res
            .status(404)
            .json({ login: false, message: "User not found" });
        }
        res
          .status(200)
          .json({
            login: true,
            message: "Password updated successfully",
            updated: user,
          });
      }
    } catch (error) {
      res.status(500).json({ login: false, message: "An error occurred" });
    }
  }
);

customReferences.app.post("/viewAllCustomers", async (request, response) => {
  try {
    const users = await customerModel.find(); // Retrieve all Customers from MongoDB
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});

customReferences.app.delete(
  "/deleteCustomer/:customerId",
  async (request, response) => {
    try {
      const { customerId } = request.params;

      // Find and delete the customer by ID
      const deletedCustomer = await customerModel.findByIdAndDelete(customerId);

      if (deletedCustomer) {
        response.json({
          success: true,
          message: "Customer deleted successfully.",
        });
      } else {
        response.json({ success: false, message: "Customer not found." });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);

customReferences.app.put(
  "/toggleUserStatus/:userId",
  async (request, response) => {
    try {
      const { userId } = request.params;

      // Find the user by ID
      const user = await customerModel.findById(userId);

      if (!user) {
        return response.json({ success: false, message: "User not found." });
      }

      // Toggle the user status between 0 and 1
      user.status = user.status === 1 ? 0 : 1;

      // Save the updated user
      const updatedUser = await user.save();

      response.json({
        success: true,
        message: "User status updated successfully.",
        updatedUser,
      });
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);

// Route to save address
customReferences.app.post("/saveAddress", formData.none(), async (req, res) => {
  console.log("profileData", req.body);
  const { address, _id } = req.body;

  const parsedAddress = JSON.parse(address);
  try {
    const user = await customerModel.findOneAndUpdate(
      { _id },
      {
        $push: {
          addresses: parsedAddress,
        },
      },
      { new: true }
    );
    console.log("registeredUser", user);
    if (user) {
      res.json({ message: "Address saved successfully", registeredUser:user });
    } else {
      res.status(500).json({ error: "Failed to save address" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

customReferences.app.delete('/deleteAddress', formData.none(), async (req, res) => {
  try {
    const { deletedAddressId, _id } = req.body;

    const user = await customerModel.findOneAndUpdate(
      { _id },
      {
        $pull: { addresses: { _id: deletedAddressId } },
      },
      { new: true }
    );

    if (user) {
      res.json({ message: 'Address deleted successfully', registeredUser: user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// const jwt = require('jsonwebtoken');

// const authenticateUser = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Token is not valid' });
//   }
// };

