import colorModel from "../../models/colorModel.js";
import orderModel from "../../models/orderModel.js";
import productsModel from "../../models/productsModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import variantModel from "../../models/variantModel.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";

const create = async (data) => {
  return await orderModel.create(data);
}

const findOne = async({payload = {}, projection = {}}) => {
  return await orderModel.findOne({payload}, {projection});
}

const findOneAndUpdate = async (id, data) => {
  return await orderModel.findOneAndUpdate(id, data);
}

const checkoutPage = async (req) => {
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
    const variantColor = await variantColorModel.filter({
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

    const colors = await colorModel.filter({
      filter: {
        _id: { $in: colorIds }
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
    const variants = await variantModel.filter({
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
    const products = await productsModel.filter({
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
    return arrayVariantAddColor
}
export default {
  create, findOne, findOneAndUpdate, checkoutPage
}