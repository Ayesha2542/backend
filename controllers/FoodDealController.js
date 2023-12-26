const customReferences = require("../references/customReferences");
const foodDealModel=require("../model/foodDealModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const foodDealImageMW=require('../MiddleWare/foodDealImageMW')

customReferences.app.post(
  "/addFoodDeals",
  foodDealImageMW("foodDeals").single("foodDealImage"),
  async (req, res) => {
    try {

      const result = await foodDealModel.create({
        foodDealTitle: req.body.foodDealTitle,
        foodDealDescription: req.body.foodDealDescription,
        foodDealPrice: req.body.foodDealPrice,
        foodDealImage: "/foodDeals/" + req.file.filename,
        restaurant_id:req.body.restaurant_id,
        // foodDealDiscount:req.body.foodDealDiscount,
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

customReferences.app.post("/updateFoodDeals", 
foodDealImageMW("foodDeals").any("foodDealImage"), 
async (req, res) => {
  try {
    console.log(req.files);
    let obj = {};
    if (req.files.length > 0) {
      obj = {
        _id: req.body.foodDeal_Id,
        foodDealTitle: req.body.foodDealTitle,
        foodDealDescription: req.body.foodDealDescription,
        foodDealPrice: req.body.foodDealPrice,
        // foodDealDiscount:req.body.foodDealDiscount,
        foodDealImage: "/foodDeals/" + req.files[0].filename,  // <-- Add the missing forward slash here
      };
    } else {
      obj = {
        _id: req.body.foodDeal_Id,
        foodDealTitle: req.body.foodDealTitle,
        foodDealDescription: req.body.foodDealDescription,
        foodDealPrice: req.body.foodDealPrice,
        // foodDealDiscount:req.body.foodDealDiscount,
      };
    }
    console.log(req.body);
    const result = await foodDealModel.updateOne({ _id: obj._id }, { $set: obj });

    if (result.modifiedCount === 1) {
      res.json({ update: true });
    } else {
      res.json({ update: false, message: "No Deal was updated." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ update: false, message: "Internal server error." });
  }
});


customReferences.app.post("/viewAllFoodDeals/:restaurant_id", async (req, res) => {
  const { restaurant_id} = req.params; 
  try {
    const allProducts = await foodDealModel
      .find({ restaurant_id: restaurant_id})
      .populate('restaurant_id')
      
    console.log("++++++++++++++++++++++++++++");
    console.log(allProducts);
    console.log("++++++++++++++++++++++++++++");
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ allProducts: [] });
  }
});

// customReferences.app.post("/viewAll/:restaurant_id", async (req, res) => {
//   const {restaurant_id} = req.params; 
//   try {
//     const all = await foodDealModel
//       .find({restaurant_id:restaurant_id})
//       .populate('restaurant_id')

//     console.log("++++++++++++++++++++++++++++");
//     console.log(all);
//     console.log("++++++++++++++++++++++++++++");
//     res.json(all);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ all: [] });
//   }
// });


customReferences.app.delete("/deleteFoodDeal/:delId", async (req, res) => {
  try {
      const {delId} = req.params;
    const result = await foodDealModel.findByIdAndDelete(delId);
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
