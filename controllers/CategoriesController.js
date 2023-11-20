
const customReferences = require("../references/customReferences");
const categoryModel=require("../model/categoryModel");
const formData = customReferences.multer();
const bcrypt = require("bcrypt");
const imageUploadMW=require('../MiddleWare/imageUploadMW')


customReferences.app.post(
    "/addCategories",
    imageUploadMW("Categories").single("categoryImage"),
    async (req, res) => {
      try {
        console.log(req.file);
        console.log(req.body);
        
        const result = await categoryModel.create({
          title: req.body.title,
          categoryImage: "/Categories/" + req.file.filename,
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
  
customReferences.app.post(
    "/updateCategory",
    imageUploadMW("Categories").any("categoryImage"),
    async (req, res) => {
      try {
        console.log(req.files);
        let obj = {};
  
        if (req.files.length > 0) {
          obj = {
            _id: req.body.categoryId,
            title: req.body.title,
            categoryImage: "/Categories/" + req.files[0].filename,
          };
        } else {
          obj = {
            _id: req.body.categoryId,
            title: req.body.title,
          };
        }
  
        console.log(req.body);
  
        const result = await categoryModel.updateOne({ _id: obj._id }, { $set: obj });
        console.log(result);
  
        if (result.modifiedCount === 1) {
          res.send({ update: true });
        } else {
          res.send({ update: false });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ update: false });
      }
    }
  );

    // Create a new category
   
    customReferences.app.delete("/deleteCategory/:delId", async (req, res) => {
        try {
            const {delId} = req.params;
          const result = await categoryModel.findByIdAndDelete(delId);
          console.log(".......................")
          console.log(result);
          console.log(".......................")    
          if (result) {
            res.json({ success: true, message: "Customer deleted successfully." });
          } else {
            res.json({ success: false, message: "Customer not found." });
        }
        } catch (error) {
          console.error(error);
          res.status(500).send({ update: false });
        }
      });


  customReferences.app.post("/viewAllCategories", async (req, res) => {
    try {
      const allCategories = await categoryModel.find();
    //   res.json(allCategories)
      console.log("++++++++++++++++++++++++++++")
      console.log(allCategories);
      console.log("++++++++++++++++++++++++++++")
     res.json(allCategories)
    } catch (error) {;
      console.error(error);
      res.status(500).send({ allCategories: [] });
    }
  });