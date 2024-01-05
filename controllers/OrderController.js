const customReferences = require("../references/customReferences");
const orderModel = require("../model/orderModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");


customReferences.app.post(
  "/addOrder", formData.none(),
  async (req, res) => {

    try {
      const uniqueId = randomstring.generate(8);
      const result = await orderModel.create({
        customer_id: req.body.customer_id,
        orderId: uniqueId,
        customerName:req.body.customerName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        customerEmail: req.body.customerEmail,
        deliveryAddress: req.body.deliveryAddress,
        products:JSON.parse(req.body.products),
        deliveryFee: req.body.deliveryFee,
        totalAmount: req.body.totalAmount,
        status: ['New Order'],
        restaurant_id: req.body.restaurant_id,
        // isShared:req.body.isShared,
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