const customReferences = require("../../references/customReferences");
const subAdminModel=require("../../model/subAdminModel");
const formData = customReferences.multer();

customReferences.app.post("/addSubAdmin", formData.none(), async (request, response) => {
  const { name, email } = request.body;
    console.log("Received data:", { name, email,});
  try {
    
    
    // Check if a user with the same email already exists
    const existingUser = await subAdminModel.findOne({ email:email });
    console.log('check if user exists',existingUser);

    if (existingUser) {
      return response.json({
        save: false,
        message: "A user with the same email already exists.",
      });
    }
    console.log('check if user exists',existingUser);//kuch likha tha many dekha nai?


    // Create a new user
    const newSubAdmin = new subAdminModel({
      name,
      email,
    });

    // Save the user to the database
    const res = await newSubAdmin.save();
// console.log('user saved or not')
    if (res) {
      response.json({ save: true, message: "User registered successfully.",newSubAdmin:res });
    } else {
      response.json({ save: false, message: "Failed to register user." });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
}
);
