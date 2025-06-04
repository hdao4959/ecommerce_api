import productsModel from "../../models/productsModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import colorService from "../../services/Client/colorService.js";
import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import { successResponse } from "../../utils/response.js";

const detail = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const idVariantColor = req.query.id;

    
    const productLine = await productService.findOneBy({
      payload: { slug, is_active: true },
      projection: { created_at: 0, updated_at: 0, deleted_at: 0, status: 0 }
    })

    const variants = await variantService.filter({
      filter: {
        product_id: productLine._id
      }
    })
    const variantMap = variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = { ...variant, colors: [] }
      return acc
    }, {})
    const variantIds = variants.map(variant => variant._id);
    
    const variantColor = await variantColorService.filter({
      filter: {
        variant_id: { $in: variantIds },
        is_active: true
      }
    })


    const colorIds = variantColor.map(varColor => ConvertToObjectId(varColor.color_id));
    
    const colors = await colorService.filter({
      filter: {
        _id: {$in: colorIds},
        is_active: true
      }, projection: {
        created_at: 0, updated_at: 0, deleted_at: 0
      }
    })

    variantColor.forEach(varColor => {
      const key = varColor.variant_id.toString()
      variantMap[key].colors.push(varColor)
    })
    
    

    const newarrayVariants = Object.values(variantMap)

    return successResponse(res, {
      data: {
        productLine: productLine,
        variants: newarrayVariants,
        variantColor: variantColor,
        colors: colors,
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  detail
}