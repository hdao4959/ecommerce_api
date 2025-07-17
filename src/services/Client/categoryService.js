import categoryModel from '../../models/categoryModel.js'
import productModel from '../../models/productsModel.js'
import { ConvertToObjectId } from '../../utils/ConvertToObjectId.js'
import ErrorCustom from '../../utils/ErrorCustom.js'
import variantModel from '../../models/variantModel.js'
const getAllActive = async () => {
  const categories = await categoryModel.join([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ['$is_active', true] },
            { $eq: ['$parent_id', null] },
            { $ne: ['$type', 'not_delete'] }
          ]
        }
      }
    }, {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent_id',
        as: 'children'
      }
    }
  ])
  return categories
}

const getProductsOfCategory = async (categoryId, query) => {

  const sortObject = {
    ['variant.color.' + query?.sortBy || 'created_at']: query?.orderBy == 'asc' ? 1 : -1
  }

  const limit = parseInt(query?.limit) || 10

  const category = await categoryModel.join([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ['$_id', ConvertToObjectId(categoryId)] },
            { $ne: ['$is_active', false] },
          ]
        }
      }
    }, {
      $lookup: {
        from: 'categories',
        let: {
          parentId: '$parent_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$parentId']
              }
            }
          }
        ],
        as: 'parent'
      }
    }, {
      $unwind: "$parent"
    }, {
      $limit: limit
    }
  ])

  if (!category.length) throw new ErrorCustom("Danh mục sản phẩm không tồn tại!", 404)

  const products = await productModel.join([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ['$category_id', ConvertToObjectId(categoryId)] },
            { $ne: ['$is_active', false] }
          ]
        }
      }
    }, {
      $lookup: {
        from: variantModel.COLLECTION,
        let: {
          productId: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$is_active', false] },
                  { $eq: ['$product_id', '$$productId'] }
                ]
              }
            }
          }, {
            $limit: 1
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
                      $eq: ['$variant_id', '$$variantId'],
                    }
                  }
                }, {
                  $limit: 1
                }
              ],
              as: 'color'
            }
          }
        ],
        as: 'variant'
      }
    }, {
      $unwind: {
        path: '$variant',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $unwind: {
        path: '$variant.color',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $sort: sortObject
    }
  ])

  const seenProductIds = new Set();
  const productIds = []
  products.forEach(p => {
    const productId = p._id.toString();
    if (!seenProductIds.has(productId)) {
      seenProductIds.add(productId)
      productIds.push(ConvertToObjectId(productId))
    }
  })

  const totalVariantFiltered = products?.length;
  const totalVariants = await variantModel.countFiltered({
    product_id: { $in: productIds },
  })

  return {
    products,
    totalVariantFiltered,
    totalVariants,
    category: category[0]
  }
}

export default {
  getAllActive, getProductsOfCategory
}