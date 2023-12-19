
const uploadMW2 =()=>{ 
    console.log('before')
    
   return CustomReferences.multer({
    storage: CustomReferences.multer.diskStorage({
  
      destination: function  (req, file, cb) {
         console.log('in middleware',file)
     
        const folderName = (file.fieldname === 'Certificate') ? 'Certificate' : 'Restaurants'; // this is the name of folder
        console.log("folder", folderName);
        cb(null, `./public/assets/images/${folderName}`);
        // }
      },
      filename: function (req, file, cb) {
        const now = Date.now();
        cb(null,`${file.fieldname}${now}.jpg`);
      },
     
    })
  }).fields([
    { name: "Certificate" },
    { name: "Restaurants" }  // <-- This is the key of form data
  ]);
  }