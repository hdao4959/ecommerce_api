import { pipeline } from "stream";
import productsModel from "../../models/productsModel.js";
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import variantColorModel from "../../models/variantColorModel.js";
import fs from 'fs/promises'
const getAll = async ({ query = {}, projection = {} } = {}) => {
  return await variantModel.getAll({ query, projection });
}

const getAllWithMetadata = async (query) => {

  let conditions = [];
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy == 'asc' ? 1 : -1
  console.log(sortObject);
  
  const limit = parseInt(query?.limit) || 10;
  const skip = parseInt(query?.offset) || 0;
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

  const variants = await variantModel.join([
    {
      $match: conditions
    },
    {
      $lookup: {
        from: 'products',
        let: {
          productId: '$product_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$productId']
              }
            }
          }
        ],
        as: 'product'
      }
    }, {
      $unwind: '$product'
    }, {
      $lookup: {
        from: 'variant_color',
        let: {
          variantId: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$variant_id', '$$variantId']
              }
            }
          }, {
            $lookup: {
              from: 'colors',
              localField: 'color_id',
              foreignField: '_id',
              as: 'color'
            }
          }, {
            $unwind: '$color'
          }
        ],
        as: 'variantColor'
      }
    }, {
      $sort: sortObject
    },
    {
      $skip: skip
    }, {
      $limit: limit
    }
  ])

  const total = await variantModel.countAll();
  const totalFiltered = variants.length
  return {
    items: variants,
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
  const variant = await variantModel.findById(ConvertToObjectId(id));
  if (!variant) {
    throw new ErrorCustom('Biến thể này không tồn tại!', 404);
  }
  // Xoá biến thể
  const variantColors = await variantColorModel.filter({
    filter: {
      variant_id: ConvertToObjectId(id)
    }
  })
  // Lấy tất cả hình ảnh cần xoá
  const imgPaths = variantColors.map(varColor => varColor.img);
  await Promise.all(imgPaths.map(path => {
    try {
      fs.unlink(`${path}`)
    } catch (error) {
      console.log(`Không thẻ xoá ${path}: ${error}`);

    }
  }))
  await variantColorModel.deleteMany({
    variant_id: ConvertToObjectId(id)
  })
  await variantModel.destroy(ConvertToObjectId(id));
}

export default {
  create, getAll, insertMany, findById, findOneBy, filter, destroy, getAllWithMetadata
}