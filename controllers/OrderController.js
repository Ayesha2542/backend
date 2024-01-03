const customReferences = require("../references/customReferences");
const orderModel=require("../model/orderModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");



customReferences.app.post(
  "/addOrder", formData.none(),
  async (req, res) => {
    try {

      const result = await orderModel.create({
        customer_id: req.body.customer_id,
        restaurant_id: req.body.restaurant_id,
        totalAmount: req.body.totalAmount,
        deliveryFee:req.body.deliveryFee,
        // Status:req.body.Status,
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