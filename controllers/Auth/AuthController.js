const userModel = require("../../model/User");
const adminModel = require("../../model/Admin");
const customReferences = require("../../references/customReferences");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");

customReferences.app.post(
  "/signup", 
  formData.none(),
  async (request, response) => {
    try {
      const { name, email, password } = request.body;

      // Check if user with the same email already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return response.json({
          save: false,
          message: "A user with the same email already exists.",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      const res = await newUser.save();

      if (res) {
        response.json({ save: true, message: "User registered successfully." });
      } else {
        response.json({ save: false, message: "Failed to register user." });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);
customReferences.app.post("/login", formData.none(), async (request, response) => {
  try {
    const { email, password } = request.body;

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (user) {
      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        response.json({"match": true, "loggedInUser": user});
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
