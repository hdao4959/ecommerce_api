import colorService from "../services/colorService.js";
import productService from "../services/productService.js";
import variantService from "../services/variantService.js";
import { successResponse } from "../utils/response.js";
import categoryService from "../services/categoryService.js";

const getAll  = async (req, res, next) => {
  try {
    const result = await productService.getAll();
    return successResponse(res, {data: result}, 200);
  } catch (error) {
    next(error)
  }
}

const detail = async(req ,res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    const category = await categoryService.findById(product.category_id);
    product.category = category
    if(product.category.parent_id) {
      const parent = await categoryService.getParentCategory(product.category.parent_id);
      if(parent){
        product.category.parent = parent;
      }
    }
    const variants = await variantService.filter({product_id: product._id})

    const variantIds = variants.map(variant => variant._id);
    const colors = await colorService.filter({variant_id: { $in: variantIds}})

    const colorMap = colors.reduce((map, color) => {
      const variantId = color.variant_id.toString();
      if(!map[variantId]) map[variantId] = [];
      map[variantId].push(color);
      return map
    }, {})

    for(const variant of variants) {
      variant.colors = colorMap[variant._id.toString()] || [];
    }

    product.variants = variants;

    // const response = {
    //   ... product,
    //   variants: variants
    // }
    return successResponse(res, {data: product}, 200)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await productService.create(req.body)
    return successResponse(res, {message: "Thêm mới sản phẩm thành công!"}, 200);
    
  }catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await productService.destroy(req.params.id);
    return successResponse(res, {message: 'Xoá sản phẩm thành công!'}, 200)
  } catch (error) {
    next(error)
  }
}

export default  {
  getAll, create, detail, destroy
}