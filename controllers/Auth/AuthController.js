const userModel = require("../../model/User");
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