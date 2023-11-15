const customReferences = require("../references/customReferences");
const customerProfileuploadMW = customReferences
  .multer({
    storage: customReferences.multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/assets/images/customerProfiles");
      },
      filename: function (req, file, cb) {
        const now = Date.now();
        cb(null, `${file.fieldname}${now}.jpg`);
      },
    }),
  })
  .single("profileImage");
  module.exports=(customerProfileuploadMW);