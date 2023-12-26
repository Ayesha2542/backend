const customReferences = require("../references/customReferences");
const cartModel=require("../model/cartModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const cartProductImageMW=require('../MiddleWare/cartProductImageMW')


customReferences.app.post(
    "/addCartProducts",
    cartProductImageMW("cartProducts").single("productImage"),
    async (req, res) => {
      console.log('req.boy',req.body)
      try {
        
        const result = await cartModel.create({
          productName: req.body.productName,
          productImage: "/cartProducts/" + req.file.filename,
          productPrice: req.body.productPrice.toString(),
          customer_id:  req.body.customer_id
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

customReferences.app.post("/viewAllCartsProduct/:customer_id", async (req, res) => {
  const {customer_id} = req.params; 
  try {
    const all = await cartModel
      .find({customer_id:customer_id})
      

    console.log("++++++++++++++++++++++++++++");
    console.log(all);
    console.log("++++++++++++++++++++++++++++");
    res.json(all);
  } catch (error) {
    console.error(error);
    res.status(500).send({ all: [] });
  }
});

customReferences.app.delete("/deleteCartProduct/:delId", async (req, res) => {
  try {
      const {delId} = req.params;
    const result = await cartModel.findByIdAndDelete(delId);
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