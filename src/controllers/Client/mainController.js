import colorService from "../../services/Client/colorService.js";
import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
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
      filter: { product_id: { $in: productIds }, is_active: true }
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

const cartPage = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const newCart = JSON.parse(cart);

    // Mảng các id của item cart
    const seenCartItemIds = new Set();
    // Mảng các id của item cart đã được convert sang object id
    const cartItemIds = [];
    newCart.forEach(item => {
      if (!seenCartItemIds.has(item._id.toString())) {
        seenCartItemIds.add(item._id.toString());
        cartItemIds.push(ConvertToObjectId(item._id))
      }
    })

    // Tìm các biến thể sản phẩm từ cartItemIds;
    const variantColor = await variantColorService.filter({
      filter: {
        _id: { $in: cartItemIds }
      }
    });

    const seenColorIds = new Set();
    const colorIds = [];
    variantColor.forEach(varColor => {
      const colorIdString = varColor.color_id.toString();
      if (!seenColorIds.has(colorIdString)) {
        seenColorIds.add(colorIdString);
        colorIds.push(ConvertToObjectId(varColor.color_id));
      }
    })

    const colors = await colorService.filter({
      filter: {
        _id: {$in: colorIds}
      }, projection: {
        created_at: 0, updated_at: 0, deleted_at: 0, status: 0, is_active: 0
      }
    })

    const colorMap = colors.reduce((acc, color) => {
      acc[color._id.toString()] = color
      return acc
    }, {})

    const seenVariantIds = new Set();
    const variantIds = [];
    variantColor.forEach(varColor => {
      const variantIdString = varColor.variant_id.toString()
      if (!seenVariantIds.has(variantIdString)) {
        seenVariantIds.add(variantIdString)
        variantIds.push(varColor.variant_id)
      }
    })
    const variants = await variantService.filter({
      filter: {
        _id: { $in: variantIds }
      }
    })
    const seenProductIds = new Set();
    const productIds = [];
    variants.forEach(variant => {
      const productIdString = variant.product_id.toString();
      if (!seenProductIds.has(productIdString)) {
        seenProductIds.add(productIdString);
        productIds.push(variant.product_id);
      }
    })
    const products = await productService.filter({
      filter: {
        _id: { $in: productIds }
      }, projection: {
        updated_at: 0, created_at: 0, delete_at: 0, status: 0, is_active: 0
      }
    })

    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product
      return acc
    }, {})

    const variantAddedProduct = variants.map(variant => {
      return ({
        ...variant,
        product: productMap[variant.product_id.toString()]
      })
    })

    const variantAddedProductMap = variantAddedProduct.reduce((acc, varAddPrd) => {
      acc[varAddPrd._id.toString()] = varAddPrd;
      return acc
    }, {})

    const variantColorAddedVariantAndProduct = variantColor.map(varColor => {
      return ({
        ...varColor,
        variant: variantAddedProductMap[varColor.variant_id.toString()]
      })
    })

    const arrayVariantAddColor = variantColorAddedVariantAndProduct.map(v => {
      return ({
        ...v,
        color: colorMap[v.color_id]
      })
    }) 
    return successResponse(res, {
      data: {
        items: arrayVariantAddColor
      }
    }, 200)


  } catch (error) {
    next(error)
  }
}

export default {
  homePage, cartPage
}