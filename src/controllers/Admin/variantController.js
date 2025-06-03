import productService from "../../services/Admin/productService.js";
import variantColorService from "../../services/Admin/variantColorService.js";
import variantService from "../../services/Admin/variantService.js";
import { successResponse } from "../../utils/response.js";
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAll = async (req, res, next) => {
  try {
    const result = await productService.getAll();
    return successResponse(res, { data: result }, 200);
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  const variant = JSON.parse(req.body.variant)
  const colors = JSON.parse(req.body.colors)
  const images = req.files;
  try {

    const addedVariant = await variantService.create(variant)

    if (colors.length > 0) {
      const colorWithImages = colors.map((color, index) => {
        delete color.image
        return {
          ...color,
          img: images[index] ? images[index].path : null,
        }
      })
      await variantColorService.insertMany(addedVariant.insertedId, colorWithImages)
    }

    return successResponse(res, { message: "Thêm mới biến thể thành công!" }, 200);

  } catch (error) {
    if (images && images.length >= 0) {
      images.forEach(image => {
        const filePath = path.join(__dirname, '../../' + image);
        fs.unlink(filePath, (err) => {
          if (err) console.log('Lỗi xoá file:', err);

        })
      })
    }
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await productService.destroy(req.params.id);
    return successResponse(res, { message: 'Xoá sản phẩm thành công!' }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, destroy
}