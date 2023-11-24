const customReferences = require("../references/customReferences");
const productPicUploadMW = customReferences
  .multer({
    storage: customReferences.multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/assets/images/products");
      },
      filename: function (req, file, cb) {
        const now = Date.now();
        cb(null, `${file.fieldname}${now}.jpg`);
      },
    }),
  })
  .single("productImage");
  module.exports=(productPicUploadMW);