const customReferences = require("../references/customReferences");
const productPicUploadMW =(folderName)=>{ 
  return( customReferences
  .multer({
    storage: customReferences.multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `./public/assets/images/${folderName}`);
      },
      filename: (req, file, cb) => {
        const now = Date.now();
        console.log("Multer console")
        console.log(req.body)
        console.log("//////////////")
        console.log(file)
        cb(null, `${file.fieldname}${now}.jpg`);
      },
    }),
  })
  )
}
module.exports = productPicUploadMW;