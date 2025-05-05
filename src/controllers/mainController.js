import colorService from "../services/colorService.js";
import productService from "../services/productService.js";
import variantService from "../services/variantService.js";
import { successResponse } from "../utils/response.js";

const homePage = async (req, res, next) => {
  try {
    const products = await productService.getAll();

    const variants = await variantService.filter({product_id : {$in: products.map(product => product._id)}})
    const variantMap = variants.reduce((map, variant) => {
      const productId = variant.product_id.toString();
      if(!map[productId]) map[productId] = []
      map[productId].push(variant);
      return map
    }, {})

    const colors = await colorService.filter({variant_id: {$in: variants.map(variant => variant._id)}})
    const colorMap = colors.reduce((map, color) => {
      const variant_id = color.variant_id.toString();
      if(!map[variant_id]) map[variant_id] = [] 
      map[variant_id].push(color)
      return map
    }, {})

    for(const product of products) {
      const variantsOfProduct = variantMap[product._id.toString()] || [];

      for(const variant of variantsOfProduct){
        variant.colors = colorMap[variant._id]
      }
      
      product.variants = variantsOfProduct
    }

    return successResponse(res, {data: products}, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  homePage
}