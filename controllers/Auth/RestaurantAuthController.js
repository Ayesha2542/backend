const customReferences = require("../../references/customReferences");
const restaurantModel = require("../../model/restaurantModel");
const bcrypt = require("bcrypt");
const formData = customReferences.multer();
const restaurantPicMW = require('../../MiddleWare/restaurantPicMW');
customReferences.app.post(
  "/restaurantSignup",
  formData.none(),
  async (request, response) => {
    try {
      const { userName, userEmail, userPassword } = request.body;
      console.log("Received data:", { userName, userEmail, userPassword });

      // Check if a user with the same email already exists
      const existingUser = await restaurantModel.findOne({
        userEmail: userEmail,
      });
      console.log("check if user exists", existingUser);

      if (existingUser) {
        return response.json({
          save: false,
          message: "A user with the same email already exists.",
        });
      }
      console.log("check if user exists", existingUser);

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(userPassword, 10);

      // Create a new user
      const newUser = new restaurantModel({
        userName,
        userEmail,
        userPassword: hashedPassword,
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

// ********************************upload profile and security questions******************************************

// Route to save security questions and uploaded profile image
customReferences.app.post(
  "/restaurantDetail",
  restaurantPicMW(),
  async (req, res) => {
    try {
      const {
        restaurantName,
        restaurantAddress,
        restaurantPhoneNumber,
        restaurantCategories,
        _id,
      } = req.body;

      // Check if req.files is defined
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }

      // Process the image file
      const restaurantImageFilename = req.files['restaurantImage'][0].filename;

      // Process the PDF document
      const certificateDocumentFilename = req.files['certificateDocument'][0].filename;

      const rc = JSON.parse(restaurantCategories);

      console.log("Received data:", {
        restaurantName,
        restaurantPhoneNumber,
        restaurantAddress,
        restaurantCategories,
        _id,
        restaurantImage: restaurantImageFilename,
        certificateDocument: certificateDocumentFilename,
      });

      // Update the user in the database with the new restaurantImage and certificateDocument
      const user = await restaurantModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            restaurantName,
            restaurantPhoneNumber,
            restaurantAddress,
            restaurantCategories: rc,
            restaurantImage: `/restaurantImage/${restaurantImageFilename}`,
            certificateDocument: `/certificateDocument/${certificateDocumentFilename}`,
          },
        },
        { new: true }
      );

      console.log("Updated user:", user);

      if (user) {
        res.json({
          message: "Data saved successfully",
          registeredUser: user,
        });
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      console.error("Error:", error);

      // Handle the error appropriately
      res.status(500).json({ error: error.message });
    }
  }
);




customReferences.app.post(
  "/restaurantLogin",
  formData.none(),
  async (request, response) => {
    try {
      const { userEmail, userPassword } = request.body;

      // Find the user by emai
      const user = await restaurantModel.findOne({ userEmail: userEmail });
      console.log("user", user);
      if (user) {
        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(
          userPassword,
          user.userPassword
        );

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
//++++++++++++++++++++++++forget password++++++++++++++++++++++++++++++++++++\

// Assume you have an express app instance
customReferences.app.post(
  "/restaurantForgetPassword",
  formData.none(),
  async (req, res) => {
    console.log(req.body);
    console.log("signupsq req", JSON.parse(req.body.securityQuestions));
    try {
      const providedAnswers = await JSON.parse(req.body.securityQuestions);

      const result = await restaurantModel.findOne({
        userEmail: req.body.userEmail,
      });

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

customReferences.app.post(
  "/restaurantResetPassword",
  formData.none(),
  async (req, res) => {
    console.log("resetPassword", req.body);
    const { userEmail, userPassword } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    try {
      const existingUser = await restaurantModel.findOne({
        userEmail: req.body.userEmail,
      });
      console.log("existuserchngepswrd", existingUser);
      if (!existingUser) {
        return res.json({
          login: false,
          message: "This user is not available.",
        });
      } else {
        const user = await restaurantModel.findOneAndUpdate(
          { userEmail },
          { $set: { userPassword: hashedPassword } },
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

customReferences.app.put(
  "/toggleRestaurantStatus/:restaurantId",
  async (request, response) => {
    try {
      const { restaurantId } = request.params;

      // Find the user by ID
      const user = await restaurantModel.findById(restaurantId);

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

customReferences.app.post("/viewAllRestaurants", async (request, response) => {
  try {
    const users = await restaurantModel.find(); // Retrieve all Customers from MongoDB
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});

customReferences.app.post("/updateRestaurantProfile", formData.none(), async (req, res) => {
  console.log("profileData", req.body);
  const { userName, userEmail, _id, restaurantPhoneNumber } = req.body;
  
  try {
    // Check if the updated email already exists
    const existingUser = await restaurantModel.findOne({ userEmail });
    
    if (existingUser && existingUser._id.toString() !== _id) {
      // If the email exists and belongs to a different user, return an error
      return res.status(400).json({ error: "Email is already in use by another user" });
    }

    // Update the user details
    const user = await restaurantModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          userName: userName,
          userEmail: userEmail,
          restaurantPhoneNumber: restaurantPhoneNumber
        },
      },
      { new: true }
    );

    console.log('updatedUser', user);

    if (user) {
      res.json({ message: "Data saved successfully", updatedUser: user });
    } else {
      res.status(500).json({ error: "Failed to save user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


customReferences.app.post(
  "/updateRestaurantImage",
  restaurantPicMW("Restaurants").single("restaurantImage"), // Check the field name here
  async (req, res) => {
    console.log("profileData to update image", req.body);
    const imgName = req.file.filename;
    const { _id } = req.body;


    try {
      const user = await restaurantModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            restaurantImage: `/Restaurants/${imgName}`,
          },
        },
        { new: true }
      );
console.log('updatedUser',user)
      if (user) {
        res.json({ message: "Data saved successfully" ,updatedUser:user});
      } else {
        res.status(500).json({ error: "Failed to save user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
