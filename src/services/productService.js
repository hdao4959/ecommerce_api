import { client } from "../config/mongodb.js";
import categoryModel from "../models/categoryModel.js";
import colorModel from "../models/colorModel.js";
import productModel from "../models/productsModel.js"
import variantModel from "../models/variantModel.js";
import ErrorCustom from "../utils/ErrorCustom.js";
const getAll = async () => {
  return await productModel.getAll();
}
const createWithVariants = async (data) => {
  const session = await client.startSession();
  try {
    session.startTransaction();
     const { variants, ...productData } = data;

  if (!productData.category_id) {
    throw new ErrorCustom('Bạn chưa chọn danh mục sản phẩm!', 400);
  }

  const category = await categoryModel.findById(productData.category_id);
  if (!category) {
    throw new ErrorCustom("Danh mục sản phẩm không tồn tại!", 404);
  }

  const existNameProduct = await productModel.findBy({ name: productData.name })
  if (existNameProduct) {
    throw new ErrorCustom('Tên sản phẩm đã tồn tại', 409);
  }


  const product = await productModel.create(productData, {session})
  const variantsWithProductId = variants.map(variant => ({
    ...variant,
    product_id: product.insertedId
  }))

  await variantModel.insertMany(variantsWithProductId, {session})

  await session.commitTransaction();
  session.endSession();
  } catch (error) {
    await session.abortTransaction();
    throw error
  } finally{
    session.endSession()
  }
}

const findById = async (id) => {
  return await productModel.findById(id);
}

const destroy = async (id) => {
  if (!id) {
    throw new ErrorCustom('Bạn chưa chuyền id sản phẩm', 404)
  }
  const product = await productModel.findById(id);
  if (!product) {
    throw new ErrorCustom('Sản phẩm không tồn tại!', 404)
  }
  return await productModel.destroy(id);
}
export default {
  getAll, createWithVariants, findById, destroy
}