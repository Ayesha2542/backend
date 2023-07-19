const userModel = require("../../model/User");
const customReferences = require("../../references/customReferences");
const formData = customReferences.multer();


customReferences.app.post("/signup", formData.none(), async (request, response) => {
    const newUser = new userModel(request.body);
    const res = await newUser.save();
    if(res)
    {
      response.send({"save":true,"newUser":res});
    }else
    {
      response.send({"save":false});
    }
  });
  
  customReferences.app.post("/login", formData.none(), async (request, response) => {
    const res = await userModel.findOne(request.body);
  
    if(res != null)
    {
      response.send({"match":true,"loggedInUser":res});
    }else
    {
      response.send({"match":false});
    }
  });