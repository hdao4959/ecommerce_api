import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { successResponse } from "../../utils/response.js";

const homePage = async (req, res, next) => {
  try {
    const products = await productService.getAll({
      projection: { created_at: 0, updated_at: 0, deleted_at: 0, status: 0, is_active: 0 },
      query: { is_active: true }
    });
    // Mảng các id sản phẩm
    const productIds = products.map(product => product._id)
    // 1 đối tượng gồm nhiều đôi tượng sản phẩm, gồm key là id sản phẩm và giá trị là sản phẩm
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product
      return acc
    }, {})

    const variants = await variantService.filter({
      filter:  { product_id: { $in: productIds }, is_active: true }
    }
     
    );
    // Mảng gồm các id variant
    const variantIds = variants.map((variant) => variant._id)
    // 1 đối tượng gồm nhiều đối tượng variant, có key là id của từng variant
    const variantMap = variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = { ...variant, colors: [] }
      return acc
    }, {})

    const variantColor = await variantColorService.filter({ query: { is_active: true, variant_id: { $in: variantIds } }, sort: { _id: -1 } })
    for (const key in variantColor) {
      const varColor = variantColor[key]
      variantMap[varColor.variant_id.toString()].colors.push(varColor)
    }

    const convertObjectProductsToArray = Object.values(productMap);

    const newArrayProducts = convertObjectProductsToArray.map((product) => {
      const variants = Object.values(variantMap).filter(v => v.product_id.toString() == product._id.toString());
      return {
        ...product,
        variants: variants
      }
    })

    return successResponse(res, {
      data: {
        products: newArrayProducts,
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  homePage
}