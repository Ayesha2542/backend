const customReferences = require("../../references/customReferences");
const adminModel=require("../../model/adminModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");

customReferences.app.post("/adminLogin", formData.none(), async (request, response) => {
  console.log(request.body)
  try {
    const { email, password } = request.body;

    // Find the user by email
    const admin = await adminModel.findOne({ email ,password});
    console.log('admin')
    console.log(admin)
    if(admin){
      response.send({"match": true, "loggedInUser": admin})
    }
    // if (admin) {
    //   // Compare the provided password with the stored hashed password
    //   const isPasswordMatch = await bcrypt.compare(password, admin.password);
    //   console.log('isPasswordMatch')
    //   console.log(isPasswordMatch)

    //   if (isPasswordMatch) {
    //     response.json({"match": true, "loggedInUser": admin});
    //   } else {
    //     response.json({"match": false});
    //   }
    // } else {
    //   response.json({"match": false});
    // }
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});
