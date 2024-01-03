const customReferences = require("../references/customReferences");
const cartModel=require("../model/cartModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const cartProductImageMW=require('../MiddleWare/cartProductImageMW')


// cartController.js
customReferences.app.post(
  "/addCartProducts",
  cartProductImageMW("cartProducts").single("productImage"),
  async (req, res) => {
    try {
      // Ensure req.body and its properties are defined

      const existingProduct = await cartModel.findOne({
        customer_id: req.body.customer_id,
        productName: req.body.productName,
      });

      if (existingProduct) {
        // If the product is already in the cart, update the quantity
        if (req.body.qty && parseInt(req.body.qty) > 0) {
          existingProduct.qty += parseInt(req.body.qty);
        } else {
          existingProduct.qty += 1;
        }

        existingProduct.productPrice = (
          parseFloat(existingProduct.pricePerProduct) * existingProduct.qty
        ).toString();

        await existingProduct.save();
        res.send({ added: true });
      } else {
        // If the product is not in the cart, create a new entry
        const newProduct = {
          productId:req.body.productId,
          customer_id: req.body.customer_id,
          restaurant_id:req.body.restaurant_id,
          productName: req.body.productName,
          productPrice: req.body.productPrice.toString(),
          pricePerProduct:req.body.pricePerProduct
          
        };

        if (req.file) {
          newProduct.productImage = "/cartProducts/" + req.file.filename;
        }

        const result = await cartModel.create(newProduct);

        if (result) {
          res.send({ added: true });
        } else {
          res.send({ added: false });
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).send({ added: false, error: 'Internal server error' });
    }
  }
);


customReferences.app.post("/incrementCartProduct/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('productId',productId)
    const product = await cartModel.findById(productId);

    if (product) {
      product.qty += 1;
      product.productPrice = (parseFloat(product.pricePerProduct) * product.qty).toString();

      await product.save();
      res.send({ updated: true });
    } else {
      res.send({ updated: false, error: 'Product not found' });
    }
  } catch (error) {
    console.error("Error incrementing product quantity:", error);
    res.status(500).send({ updated: false, error: 'Internal server error' });
  }
});

customReferences.app.post("/decrementCartProduct/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await cartModel.findById(productId);

    if (product) {
      if (product.qty > 1) {
        product.qty -= 1;
        product.productPrice = (parseFloat(product.pricePerProduct) * product.qty).toString();

        await product.save();
        res.send({ updated: true });
      } else {
        // If the quantity is 1, delete the product
        const result = await cartModel.findByIdAndDelete(productId);

        if (result) {
          res.send({ updated: true, deleted: true });
        } else {
          res.send({ updated: false, deleted: false, error: 'Product not found' });
        }
      }
    } else {
      res.send({ updated: false, deleted: false, error: 'Product not found' });
    }
  } catch (error) {
    console.error("Error decrementing product quantity:", error);
    res.status(500).send({ updated: false, deleted: false, error: 'Internal server error' });
  }
});






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