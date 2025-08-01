const multer=require('multer');
const path=require('path');
const storage=multer.diskStorage({
    destination:function(req,file,cb)
{
    cb(null,"public/uploads/logo");
},
filename:function(req,file,cb){
    const fileName=Date.now()+'-'+file.originalname;
    cb(null,fileName);
}
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;