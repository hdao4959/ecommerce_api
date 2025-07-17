import { client } from "../../config/mongodb.js";
import categoryModel from "../../models/categoryModel.js";
import colorModel from "../../models/colorModel.js";
import productModel from "../../models/productsModel.js"
import variantColorModel from "../../models/variantColorModel.js";
import variantModel from "../../models/variantModel.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
const getAll = async ({ query } = {}) => {
  const filter = [];


  if (query && query.active) {

    switch (query.active) {
      case '1':
        filter.push(
          { is_active: true }
        )
        break;
      case '0':
        filter.push(
          { is_active: false }
        )
    }
  }

  if (query && query.search) {
    filter.push(
      {
        $or: [
          {
            name: { $regex: query.search.trim(), $options: 'i' },
          }, {
            slug: { $regex: query.search.trim(), $options: 'i' },
          }
        ]
      }
    )
  }

  const finalQuery = filter.length > 0 ? { $and: filter } : {}
  return await productModel.getAll({ query: finalQuery });
}

const getAllWithMetadata = async (query) => {
  let conditions = []
  if (query?.active) {
    switch (query.active) {
      case 1:
        conditions.push(
          { is_active: true }
        )
        break;
      case 0:
        conditions.push(
          { is_active: false }
        )
    }
  }

  if (query?.search) {
    conditions.push({
      $or: [
        {
          name: { $regex: query.search.trim(), $options: 'i' }
        }
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const products = await productModel.getAll({ conditions, query })
  const total = await productModel.countAll();
  const totalFiltered = await productModel.countFiltered(conditions)
  return {
    items: products,
    meta: {
      total,
      totalFiltered
    }
  }
}

const create = async (data) => {
  // Nếu có id danh mục con thì gán id danh mục con thay cho danh mục cha
  if (data.child_category_id) data.category_id = data.child_category_id;
  delete data.child_category_id;

  if (!data.category_id) {
    throw new ErrorCustom('Bạn chưa chọn danh mục sản phẩm!', 400);
  }

  const category = await categoryModel.findById(data.category_id);
  if (!category) {
    throw new ErrorCustom("Danh mục sản phẩm không tồn tại!", 404);
  }

  const existNameProduct = await productModel.findOneBy({ payload: { name: data.name } })
  if (existNameProduct) {
    throw new ErrorCustom('Tên sản phẩm đã tồn tại', 409);
  }
  return await productModel.create(data)
}

const update = async (id, data) => {
  data = {
    ...data, 
    category_id: ConvertToObjectId(data?.category_id)
  }
  const product = await productModel.findById(ConvertToObjectId(id));
  if(!product) throw new ErrorCustom('Sản phẩm này không tồn tại!', 404);

  const category = await categoryModel.findById(data?.category_id);
  if(!category || !category.is_active) throw new ErrorCustom('Danh mục này không tồn tại!', 404);

  const existProductName = await productModel.findOneBy({
    payload: {
      _id: {
        $ne: ConvertToObjectId(id)
      },
      name: data?.name
    }
  })
  if(existProductName) throw new ErrorCustom('Tên dòng sản phẩm này đã được sử dụng');

  return await productModel.update(id, data)
}

const getDetail = async (id) => {
  const product = await productModel.join([
    {
      $match: {
        $expr: {
          $eq: ['$_id', ConvertToObjectId(id)]
        }
      }
    }, {
      $lookup: {
        from: categoryModel.COLLECTION,
        let: {
          categoryId: "$category_id"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$categoryId']
              }
            }
          },
          {
            $lookup: {
              from: categoryModel.COLLECTION,
              localField: 'parent_id',
              foreignField: '_id',
              as: 'parent',
            }
          },
           {
            $unwind: {
              path: '$parent',
              preserveNullAndEmptyArrays: true
            }
          }
        ],
        as: 'category'
      }
    }, {
      $unwind: '$category'
    }
  ])

  return {
    ... product[0] || {},

  }
}

const getVariantsOfProduct = async (productId) => {

  const prd = await productModel.findById(ConvertToObjectId(productId));
  if(!prd) throw new ErrorCustom('Dòng sản phẩm không tồn tại', 404);

  const variants = await variantModel.join([
    {
      $match: {
        $expr: {
          $eq: ["$product_id", ConvertToObjectId(productId)]
        }
      }
    },
    
    {
      $lookup: {
        from: variantColorModel.COLLECTION,
        localField: '_id',
        foreignField: 'variant_id',
        as: 'variantColor'
      }
    }, {
      $unwind: '$variantColor'
    }
  ])



  const seenColorIds = new Set();
  const colorIds = [];
  variants.forEach(variant => {
    const colorId = variant.variantColor.color_id.toString()
    if (!seenColorIds.has(colorId)) {
      seenColorIds.add(colorId)
      colorIds.push(ConvertToObjectId(colorId))
    }
  })
  const colors = await colorModel.filter({
    filter: {
      _id: {
        $in: colorIds
      }
    }
  })

  const colorMap = colors.reduce((acc, color) => {
    acc[color._id.toString()] = color.name
    return acc
  }, {})

  return {
    variants, 
    colorMap
  }
}



const filter = async ({ filter = {}, projection = {} }) => {
  return await productModel.filter({ filter, projection });
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
  getAll, getAllWithMetadata, getDetail, create, update, findById, filter, destroy, getVariantsOfProduct
}