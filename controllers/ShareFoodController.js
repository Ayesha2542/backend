const customReferences = require("../references/customReferences");
const shareFoodModel=require("../model/shareFoodModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const shareFoodImageMW=require('../MiddleWare/shareFoodImageMW')


customReferences.app.post(
    "/addShareFoodProducts",
    shareFoodImageMW("shareFoods").single("productImage"),
    async (req, res) => {
      console.log('req.boy',req.body)
      try {
        
        const result = await shareFoodModel.create({
          productName: req.body.productName,
          productImage: "/shareFoods/" + req.file.filename,
          productPrice: req.body.productPrice.toString(),
          customer_id:  req.body.customer_id,
          productDescription:req.body.productDescription,
          productPricePerPerson:req.body.productPricePerPerson,
          productSelectedDateAndTime:req.body.productSelectedDateAndTime,
          productDateAndTime:req.body.productDateAndTime,
        });
        

        if (result) {
          res.send({ added: true });
        } else {
          res.send({ added: false });
        }
      } catch (error) {
        console.error("No product added to cart");
        res.status(500).send({ added: false });
      }
    }
);

customReferences.app.post("/viewAllShareFoodProducts/:customer_id", async (req, res) => {
  const {customer_id} = req.params; 
  try {
    const all = await shareFoodModel
      .find({customer_id:customer_id})
      .populate('customer_id')


    console.log("++++++++++++++++++++++++++++");
    console.log(all);
    console.log("++++++++++++++++++++++++++++");
    res.json(all);
  } catch (error) {
    console.error(error);
    res.status(500).send({ all: [] });
  }
});

customReferences.app.post("/viewAllSharedFoodProducts", async (req, res) => {
    try {
      const allProduct = await shareFoodModel.find();
     res.json(allProduct)
    } catch (error) {;
      console.error(error);
      res.status(500).send({ allProduct: [] });
    }
  });


customReferences.app.delete("/deleteShareFoodProduct/:delId", async (req, res) => {
  try {
      const {delId} = req.params;
    const result = await shareFoodModel.findByIdAndDelete(delId);
    console.log(".......................")
    console.log(result);
    console.log(".......................")    
    if (result) {
      res.json({ success: true, message: "product deleted successfully." });
    } else {
      res.json({ success: false, message: "product not found." });
  }
  } catch (error) {
    console.error(error);
    res.status(500).send({ update: false });
  }
});