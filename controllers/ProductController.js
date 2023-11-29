const customReferences = require("../references/customReferences");
const productModel=require("../model/productModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const productPicUploadMW=require('../MiddleWare/productPicUploadMW')

customReferences.app.post(
  "/addProduct",
  productPicUploadMW("Products").single("productImage"),
  async (req, res) => {
    try {

      const result = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        productImage: "/Products/" + req.file.filename,
      });
console.log(result);

if (result) {
  res.send({ added: true });
} else {
  res.send({ added: false });
}
} catch (error) {
console.error(error);
res.status(500).send({ added: false });
}
}
);

customReferences.app.post("/updateProduct", 
productPicUploadMW("Products").any("productImage"), 
async (req, res) => {
  try {
    console.log(req.files);
    let obj = {};
    if (req.files.length > 0) {
      obj = {
        _id: req.body.productId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        productImage: "/Products/" + req.files[0].filename,  // <-- Add the missing forward slash here
      };
    } else {
      obj = {
        _id: req.body.productId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      };
    }
    console.log(req.body);
    const result = await productModel.updateOne({ _id: obj._id }, { $set: obj });

    if (result.modifiedCount === 1) {
      res.json({ update: true });
    } else {
      res.json({ update: false, message: "No product was updated." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ update: false, message: "Internal server error." });
  }
});




customReferences.app.post("/viewAllProducts", async (req, res) => {
  try {
    const allProducts = await productModel.find();
  //   res.json(allCategories)
    console.log("++++++++++++++++++++++++++++")
    console.log(allProducts);
    console.log("++++++++++++++++++++++++++++")
   res.json(allProducts)
  } catch (error) {
    console.error(error);
    res.status(500).send({ allProducts: [] });
  }
});


customReferences.app.delete("/deleteProduct/:delId", async (req, res) => {
  try {
      const {delId} = req.params;
    const result = await productModel.findByIdAndDelete(delId);
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
