const customReferences = require("../references/customReferences");
const productModel=require("../model/productModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const productPicUploadMW=require('../MiddleWare/productPicUploadMW')

customReferences.app.post(
  "/addProduct",
  productPicUploadMW,
  async (request, response) => {
    try {
      const { title,  description, price } = request.body;
      console.log("Received data:", { title, description, price });
      const imgName = request.file.filename

      // Create a new product
      const newProduct = new productModel({
        productImage: `/productPic/${imgName}`,
        title,
        description,
        price,
      });

      // Save the product to the database
      const res = await newProduct.save();
// console.log('product saved or not')
      if (res) {
        response.json({ save: true, message: "saved successfully.",newProduct:res });
      } else {
        response.json({ save: false, message: "Failed ." });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal server error." });
    }
  }
);

