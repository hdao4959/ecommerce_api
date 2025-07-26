import productsModel from "../../models/productsModel.js";
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import variantColorModel from "../../models/variantColorModel.js";
import fs from 'fs/promises'
import variantSpecificationModel from "../../models/variantSpecificationModel.js";
import { client } from "../../config/mongodb.js";
import colorModel from "../../models/colorModel.js";
import specificationModel from "../../models/specificationModel.js"
import variantColorService from "../Client/variantColorService.js";
import imageService from "./imageService.js";
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
    console.log("variant", variant);
    
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

const update = async (id, data, images) => {
  const session = await client.startSession();
  session.startTransaction();
  try {
    const variantId = ConvertToObjectId(id)

    //1. Xử lí update variant
    // Tìm bản ghi xem có tồn tại?
    const variant = await variantModel.findById(variantId);
    if (!variant) throw new ErrorCustom('Biến thể này không tồn tại!', 404)

    const dataOfVariant = {
      ...data.variant,
      product_id: ConvertToObjectId(data.variant.product_id)
    }

    // Update các trường chính của variant
    await variantModel.update(ConvertToObjectId(id), dataOfVariant, { session })


    //2. Xử lí danh sách thông số
    const formSpecification = data.specifications.map(item => ({
      ...item,
      _id: ConvertToObjectId(item._id)
    }))

    // Danh sách id specification được gửi lên từ FE
    const specificationIds = formSpecification.map(spec => spec._id)

    // Kiểm tra các thông số xem có tồn tại trong db không
    const existSpecifications = await specificationModel.filter({
      _id: { $in: specificationIds }
    }, {
      projection: {
        _id: 1
      }
    }, { session })

    if (specificationIds?.length !== existSpecifications?.length) throw new ErrorCustom('Một vài thông số không tồn tại trong hệ thống!', 419)
    // Xoá các thông số không được gửi lên BE
    await variantSpecificationModel.deleteMany({
      variant_id: ConvertToObjectId(id),
      specification_id: {
        $nin: specificationIds
      }
    }, { session })

    //Cập nhật và thêm thông số cho biến thể
    await variantSpecificationModel.insertAndUpdateMany(ConvertToObjectId(id), formSpecification, { session })


    //3. Xử lí biến thể màu sắc
    let imgsOfVariantColorShouldDelete = []
    // Mảng color id của variantColor đã thay đổi hình ảnh mới
    const colorIdsChangedImage = [];

    const formVariantColor = data.colors.map((item, index) => {
      const cloneVariantColor = {
        ...item,
        color_id: ConvertToObjectId(item?.color_id),
        variant_id: variantId
      }
      delete cloneVariantColor?.image

      if (images && images?.[item.color_id]) {
        colorIdsChangedImage.push(item.color_id);
        cloneVariantColor.img = images[item.color_id]?.path || null
      }

      return cloneVariantColor
    })

    const colorIdsOfFormVariantColor = formVariantColor?.map(item => item?.color_id.toString());

    
    const variantColor = await variantColorModel.filter({
      filter: {
        variant_id: variantId
      },
      options: {
        session,
        projection: {
          color_id: 1,
          img: 1
        }
      }
    })

    const oldImgOfVariantColor = variantColor?.filter(item => colorIdsChangedImage.includes(item?.color_id?.toString()))

    if (oldImgOfVariantColor?.length) {
      oldImgOfVariantColor.map(item => {
        imgsOfVariantColorShouldDelete.push(item?.img)
      })
    }
    
    const variantColorShouldBeDelete = variantColor?.filter(item => !colorIdsOfFormVariantColor.includes(item.color_id.toString()))


    if (variantColorShouldBeDelete?.length) {
      variantColorShouldBeDelete.map(item => {
        imgsOfVariantColorShouldDelete.push(item?.img)
      })

      await variantColorModel.deleteMany({
        variant_id: variantId,
        color_id: {
          $in: variantColorShouldBeDelete.map(item => ConvertToObjectId(item.color_id))
        }
      }, { session })
    }

    await variantColorModel.insertAndUpdateMany(variantId, formVariantColor)

    await imageService.deleteMany(imgsOfVariantColorShouldDelete)

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    throw new ErrorCustom(error.message, 500)
  } finally {
    session.endSession()
  }
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
  } finally {
    session.endSession();
  }
}

const detailById = async (id) => {
  const variant = await variantModel.findById(ConvertToObjectId(id));
  const product = await productsModel.findById(ConvertToObjectId(variant.product_id))

  const variantSpecification = await variantSpecificationModel.join([
    {
      $match: {
        $expr: {
          $eq: ['$variant_id', ConvertToObjectId(id)]
        }
      }
    }, {
      $lookup: {
        from: 'specifications',
        let: {
          specificationId: '$specification_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$specificationId']
              }
            }
          }, {
            $project: {
              created_at: 0,
              updated_at: 0,
              deleted_at: 0,
              is_active: 0
            }
          }
        ],
        as: 'specification'
      }
    }, {
      $unwind: "$specification"
    }
  ])

  const variantColor = await variantColorModel.join([
    {
      $match: {
        $expr: {
          $eq: ['$variant_id', ConvertToObjectId(id)]
        }
      }
    }, {
      $project: {
        created_at: 0,
        updated_at: 0,
        deleted_at: 0
      }
    },
    {
      $lookup: {
        from: colorModel.COLLECTION,
        let: {
          colorId: '$color_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$colorId']
              }
            }
          }, {
            $project: {
              created_at: 0,
              updated_at: 0,
              deleted_at: 0,
              is_active: 0,
              status: 0
            }
          }
        ],
        as: 'color'
      }
    },
    {
      $unwind: '$color'
    }

  ])
  return {
    product,
    variant,
    variantSpecification,
    variantColor
  }
}

export default {
  create, getAll, destroy, getAllWithMetadata, detailById, update
}