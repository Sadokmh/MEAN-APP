const multer = require('multer');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({ // where multer should put files which it detects un the incoming request
    destination: (req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; //check if the file type is one of our defined types 
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error,"backend/images"); //cb: Callback
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);  //cb: Callback
    }
}); 



module.exports = multer({storage: storage}).single("image"); 