import productsModel from "../../models/productsModel.js";
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const getAll = async ({ query = {}, projection = {} } = {}) => {
  return await variantModel.getAll({ query, projection });
}

const getAllWithMetadata = async (query) => {

  let conditions = [];
  if (query?.search) {
    conditions.push({
      $or: [
        {
          name: { $regex: query.search.trim(), $options: 'i' }
        }
      ]
    })
  }

  if (query?.active) {
    switch (query.active) {
      case 1:
        conditions.push({
          is_active: true
        })
        break;
      case -1:
        conditions.push({
          is_active: false
        })
    }
  }


  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const variants = await variantModel.getAll({ conditions, query });

  const seenProductIds = new Set()
  const productObjectIds = [];
  variants.forEach(variant => {
    if (!seenProductIds.has(variant.product_id)) {
      seenProductIds.add(variant.product_id)
      productObjectIds.push(ConvertToObjectId(variant.product_id))
    }
  });

  const products = await productsModel.filter({
    filter: {
      _id: { $in: productObjectIds }
    }
  })

  const productMap = products.reduce((acc, product) => {
    acc[product._id.toString()] = product
    return acc
  }, {})

  const variantAddProduct = variants.map(variant => {
    const productId = variant.product_id.toString();
    return ({
      ...variant,
      product: productMap[productId]
    })
  })

  const total = await variantModel.countAll();
  const totalFiltered = await variantModel.countFiltered(conditions)
  return {
    items: variantAddProduct,
    meta: {
      total,
      totalFiltered
    }
  }
}

const create = async (data) => {

  if (data.product_id) {
    const product = await productsModel.findById(data.product_id);
    if (!product) {
      throw new ErrorCustom('Dòng sản phẩm bạn chọn không tồn tại!', 404);
    }
  }

  if (data.name) {
    const existNameVariant = await variantModel.findOneBy({ name: data.name, product_id: data.product_id });
    if (existNameVariant) {
      throw new ErrorCustom("Tên biến thể đã được tạo cho dòng sản phẩm này rồi", 409)
    }
  }
  return await variantModel.create(data);
}

const insertMany = async (array) => {
  // Chuyển đổi tất cả các id của color thành object id
  const newArray = array.map(variant => ({
    ...variant, colors: variant.colors.map(color => ConvertToObjectId(color))
  }))
  return await variantModel.insertMany(newArray);
}

const findById = async (id) => {
  return await variantModel.findById(id);
}
const findOneBy = async (payload) => {
  return await variantModel.findOneBy(payload);
}

const filter = async (filter) => {
  return await variantModel.filter(filter);
}

const destroy = async (id) => {
  const variant = await variantModel.findById(id);
  if (!variant) {
    throw new ErrorCustom('Biến thể này không tồn tại!', 404);
  }
  return await variantModel.destroy(id);

}

export default {
  create, getAll, insertMany, findById, findOneBy, filter, destroy, getAllWithMetadata
}