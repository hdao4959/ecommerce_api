import multer from "multer"
import path from 'path'
import ErrorCustom from "../utils/ErrorCustom.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // timestamp + "_" + số random * 1 tỉ
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else cb(new ErrorCustom('Chỉ cho phép upload ảnh (jpeg, jpg, png, gif)', 400))
}


const upload = multer({ storage, fileFilter })
export default upload