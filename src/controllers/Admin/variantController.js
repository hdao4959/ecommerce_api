import imageService from "../../services/Admin/imageService.js";
import productService from "../../services/Admin/productService.js";
import variantColorService from "../../services/Admin/variantColorService.js";
import variantService from "../../services/Admin/variantService.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import variantValidate from "../../validators/variantValidate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const getAll = async (req, res, next) => {
  try {
    const responseVariants = await variantService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data: {
        ...responseVariants,
      }
    }, 200);
  } catch (error) {
    next(error)
  }
}

const detail = async (req, res, next) => {
  try {
    const id = req.params.id
    const detail = await variantService.detailById(id)
    return successResponse(res, {
      data: {
        ...detail
      }
    })
  } catch (error) {
    next(error)
  }
}
const create = async (req, res, next) => {
  const images = req.files;
  try {
    const formVariant = JSON.parse(req.body?.variant)
    const formSpecification = JSON.parse(req.body?.specifications)
    const formColor = JSON.parse(req.body?.colors)
    const form = {
      variant: formVariant,
      specifications: formSpecification,
      colors: formColor,
    }
    const { error, value } = variantValidate.validate(form)
    
    if (error) {
      if (images && images.length > 0) {
        imageService.deleteMany(images.map(item => item?.path))
      }
      return errorResponse(res, {
        message: error.details[0].message
      }, 419);
    }


    await variantService.create(value, images)
    return successResponse(res, { message: "Thêm mới biến thể thành công!" }, 200);
  } catch (error) {
    if (images && images.length > 0) {
      imageService.deleteMany(images.map(item => item?.path))
    }
    next(error)
  }
}

const update = async (req, res, next) => {
  const files = req.files;

  try {
    const formVariant = JSON.parse(req.body?.variant)
    const formSpecification = JSON.parse(req.body?.specifications)
    const formColor = JSON.parse(req.body?.colors)
    const imageColorIds = req.body?.image_color_ids || []

    const images = {}
    imageColorIds?.forEach((color_id, index) => {
      images[color_id] = { path: `uploads/${files[index].filename}` }
    })

    const form = {
      variant: formVariant,
      specifications: formSpecification,
      colors: formColor,
    }

    const { error, value } = variantValidate.validate(form);

    if (error) {
      if (files && files.length > 0) {
        imageService.deleteMany(files.map(file => file?.path))
      }
      return errorResponse(res, {
        message: error.details[0]?.message
      })
    }

    await variantService.update(req.params.id, value, images);
    return successResponse(res, {
      message: 'Cập nhật biến thể thành công'
    })
  } catch (error) {

    if (files && files.length > 0) {
      imageService.deleteMany(files.map(file => file?.path))
    }
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await variantService.destroy(req.params.id);
    return successResponse(res, { message: 'Xoá sản phẩm thành công!' }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, destroy, detail, update
}