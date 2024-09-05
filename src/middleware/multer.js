import multer from "multer";



export const filtration = {
    image:["image/png","image/jpeg"],
    video:["video/mp4"],
    pdf:["application/pdf"],
}

export const multerHost = (customeValidation) => {
    
    const storage = multer.diskStorage({})
    
    const fileFilter = function (req, file, cb) {
        if (customeValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error("file Not Supported"), false)
    }
    const upload = multer({ fileFilter, storage })
    return upload;
}