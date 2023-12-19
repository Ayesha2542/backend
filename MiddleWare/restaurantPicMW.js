const customReferences = require("../references/customReferences");

// Middleware function
const restaurantPicMW = () => {
  // Define your storage configuration for multer
  const storage = customReferences.multer.diskStorage({
    destination: function (req, file, cb) {
      const folderName = file.fieldname === 'certificateDocument' ? 'certificateDocument' : 'restaurantImage';
      cb(null, `./public/assets/images/${folderName}`);
    },
    filename: function (req, file, cb) {
      const now = Date.now();
      const fileExtension = file.fieldname === 'certificateDocument' ? 'pdf' : 'jpg';
      cb(null, `${file.fieldname}${now}.${fileExtension}`);
    },
  });

  // Create multer instance with your storage configuration
  const upload = customReferences.multer({ storage: storage });

  return upload.fields([
    { name: 'certificateDocument', maxCount: 1 },
    { name: 'restaurantImage', maxCount: 1 },
  ]);
};

module.exports = restaurantPicMW;
