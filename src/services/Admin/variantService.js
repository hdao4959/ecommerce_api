import { pipeline } from "stream";
import productsModel from "../../models/productsModel.js";
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import variantColorModel from "../../models/variantColorModel.js";
import fs from 'fs/promises'
import variantSpecificationModel from "../../models/variantSpecificationModel.js";
import { client } from "../../config/mongodb.js";
const getAll = async ({ query = {}, projection = {} } = {}) => {
  return await variantModel.getAll({ query, projection });
}

const getAllWithMetadata = async (query) => {

  let conditions = [];
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy == 'asc' ? 1 : -1

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
  const totalFiltered = await variantModel.countFiltered(conditions);
  return {
    items: variants,
    meta: {
      total,
      totalFiltered
    }
  }
}

const create = async (req) => {
  const session = await client.startSession()
  session.startTransaction()
  try {

    const variant = JSON.parse(req.body.variant);
    const specifications = JSON.parse(req.body.specifications);
    const colors = JSON.parse(req.body.colors);
    const images = req.files

    if (variant.product_id) {
      const product = await productsModel.findById(ConvertToObjectId(variant.product_id));
      if (!product) {
        throw new ErrorCustom('Dòng sản phẩm bạn chọn không tồn tại!', 404);
      }
      // Cập nhật active cho dòng sản phẩm khi đã có biến thể cho dòng sản phẩm này
      await productsModel.update(ConvertToObjectId(variant.product_id), {
        is_active: true
      })
    }

    if (variant.name) {
      const existNameVariant = await variantModel.findOneBy({ name: variant.name, product_id: variant.product_id });
      if (existNameVariant) {
        throw new ErrorCustom("Tên biến thể đã được tạo cho dòng sản phẩm này rồi", 409)
      }
    }
    const addedVariant = await variantModel.create(variant, { session });

    const variantWithSpecifications = specifications?.map(spec => ({
      ...spec,
      specification_id: ConvertToObjectId(spec._id),
      variant_id: ConvertToObjectId(addedVariant.insertedId)
    }))

    await variantSpecificationModel.insertMany(variantWithSpecifications, { session })

    if (colors.length > 0) {
      const colorWithImages = colors.map((color, index) => {
        const colorId = ConvertToObjectId(color._id)
        delete color._id
        delete color.image
        return {
          ...color,
          color_id: colorId,
          img: images[index] ? images[index].path : null,
          variant_id: ConvertToObjectId(addedVariant.insertedId)
        }
      })

      await variantColorModel.insertMany(colorWithImages, { session })
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error
  } finally {
    session.endSession();
  }
}


const filter = async (filter) => {
  return await variantModel.filter(filter);
}

const destroy = async (id) => {
  const session = await client.startSession();
  session.startTransaction();
  try {
    const variant = await variantModel.findById(ConvertToObjectId(id));
    if (!variant) {
      throw new ErrorCustom('Biến thể này không tồn tại!', 404);
    }
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

    await variantSpecificationModel.deleteMany({
      variant_id: ConvertToObjectId(id)
    })

    await variantModel.destroy(ConvertToObjectId(id));
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally{
    session.endSession();
  }
}

export default {
  create, getAll, filter, destroy, getAllWithMetadata
}