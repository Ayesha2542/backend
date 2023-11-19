const customReferences = require("../../references/customReferences");
const adminModel=require("../../model/adminModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");

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
