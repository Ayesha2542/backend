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
customReferences.app.post("/viewAllSubAdmins", async (request, response) => {
  try {
    const users = await subAdminModel.find(); // Retrieve all Customers from MongoDB
    console.log("+++++");
    console.log(users);
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});


customReferences.app.delete("/deleteSubAdmin/:subAdminId", async (request, response) => {
  try {
    const { subAdminId } = request.params;

    // Find and delete the customer by ID
    const deleteSubAdmin = await subAdminModel.findByIdAndDelete(subAdminId);

    if (deleteSubAdmin) {
      response.json({ success: true, message: "subAdmin deleted successfully." });
    } else {
      response.json({ success: false, message: "subAdmin not found." });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});

customReferences.app.put("/togglesubAdminStatus/:subAdminId", async (request, response) => {
  try {
    const { subAdminId } = request.params;

    // Find the user by ID
    const subAdmin = await subAdminModel.findById(subAdminId);

    if (!subAdmin) {
      return response.json({ success: false, message: "User not found." });
    }

    // Toggle the user status between 0 and 1
    subAdmin.status = subAdmin.status === 1 ? 0 : 1;

    // Save the updated user
    const updatedsubAdmin = await subAdmin.save();

    response.json({ success: true, message: "User status updated successfully.", updatedsubAdmin });
  } catch (error) {
    response.status(500).json({ error: "Internal server error." });
  }
});


