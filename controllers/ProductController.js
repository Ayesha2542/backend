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
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productImage: "/Products/" + req.file.filename,
        restaurant_id:req.body.restaurant_id,
        categoryName:req.body.categoryName,
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
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productImage: "/Products/" + req.files[0].filename,  // <-- Add the missing forward slash here
      };
    } else {
      obj = {
        _id: req.body.productId,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
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


customReferences.app.post("/viewAllProducts/:restaurant_id/:categoryName", async (req, res) => {
  const { restaurant_id, categoryName } = req.params; 
  try {
    const allProducts = await productModel
      .find({ restaurant_id: restaurant_id, categoryName: categoryName })
      .populate('restaurant_id')
      .populate('categoryName');

    console.log("++++++++++++++++++++++++++++");
    console.log(allProducts);
    console.log("++++++++++++++++++++++++++++");
    res.json(allProducts);
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
