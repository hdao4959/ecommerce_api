import colorModel from "../../models/colorModel.js";
import productsModel from "../../models/productsModel.js";
import specificationModel from "../../models/specificationModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import variantModel from "../../models/variantModel.js";
import variantSpecificationModel from "../../models/variantSpecificationModel.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";

const getAll = async ({ query = {}, projection = {} }) => {
  return await productsModel.getAll({ query, projection });
}

const getForHomePage = async (query) => {
  const categories = ['Samsung', 'Iphone', 'MacBook'];
  const sortObject = {
    [query?.sortBy || 'created_at']: query?.orderBy == 'asc' ? 1 : -1
  }
  const skip = 0
  const limit = 10

  const results = await Promise.all(categories.map(async (cate) => {
    const products = await productsModel.join([
      {
        $lookup: {
          from: 'categories',
          let: {
            categoryId: '$category_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryId'],
                }
              },
            }
          ],
          as: 'category'
        }
      }, {
        $lookup: {
          from: 'variants',
          let: {
            productId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$product_id', '$$productId']
                }
              }
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
                        $and: [
                          { $eq: ["$variant_id", "$$variantId"] },
                          { $eq: ["$is_active", true] }
                        ]
                      }
                    }
                  }
                  , {
                    $limit: 1
                  }
                ],
                as: 'color'
              }
            }, {
              $limit: 1
            }
          ],
          as: 'variant'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }

      },
      {
        $unwind: {
          path: '$variant',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$variant.color',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'category.name': cate
        }
      },
      {
        $sort: sortObject
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ])

    return {
      category: cate,
      products
    }
  }))
  return Object.values(results)
}


const filter = async ({ filter = {}, projection = {} }) => {
  return await productsModel.filter({ filter, projection })
}


const detailPage = async (req) => {
  const slug = req.params.slug;
  const productLine = await productsModel.findOneBy(
    { slug, is_active: true },
    { projection: { created_at: 0, updated_at: 0, deleted_at: 0, status: 0 } }
  )

  const variants = await variantModel.join([
    {
      $match: {
        product_id: ConvertToObjectId(productLine._id)
      }
    },
    {
      $lookup: {
        from: variantSpecificationModel.COLLECTION,
        let: {
          variantId: "$_id"
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
              from: specificationModel.COLLECTION,
              localField: 'specification_id',
              foreignField: '_id',
              as: 'specification'
            }
          },
          {
            $project: {
              _id: 0,
              specification_id: 0,
              variant_id: 0,
              specification: {
                _id: 0,
                is_active: 0,
                created_at: 0,
                updated_at: 0,
                deleted_at: 0
              }
            }
          },
          {
            $unwind: "$specification"
          }
        ],
        as: variantSpecificationModel.COLLECTION
      }
    }
  ])

  const variantMap = variants.reduce((acc, variant) => {
    acc[variant._id.toString()] = { ...variant, colors: [] }
    return acc
  }, {})
  const variantIds = variants.map(variant => variant._id);

  const variantColor = await variantColorModel.filter({
    filter: {
      variant_id: { $in: variantIds },
      is_active: true
    }
  })

  const colorIds = variantColor.map(varColor => ConvertToObjectId(varColor.color_id));

  const colors = await colorModel.filter({
    filter: {
      _id: { $in: colorIds },
      is_active: true
    }, projection: {
      created_at: 0, updated_at: 0, deleted_at: 0
    }
  })

  variantColor.forEach(varColor => {
    const key = varColor.variant_id.toString()
    variantMap[key].colors.push(varColor)
  })



  const newarrayVariants = Object.values(variantMap)

  return {
    productLine: productLine,
    variants: newarrayVariants,
    variantColor: variantColor,
    colors: colors,
  }
}

const getForSearchPage = async (req) => {
  const searchText = req.query.q

  const products = await productsModel.join([
    {
      $match: {
        is_active: true
      }
    },
    {
      $lookup: {
        from: variantModel.COLLECTION,
        let: {
          productId: "$_id"
        },
        pipeline: [
          {
            $match: {
              is_active: true,
              $text: {
                $search: searchText
              },
              $expr: {
                $eq: ['$product_id', "$$productId"]
              }
            }
          },
          {
            $lookup: {
              from: variantColorModel.COLLECTION,
              let: {
                variantId: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$variant_id", "$$variantId"] },
                        { $eq: ["$is_active", true] }
                      ]
                    }
                  }
                }
              ],
              as: 'color'
            }
          },
          {
            $project: {
              description: 0,
            }
          },
        ],
        as: 'variant'
      }
    },
    {
      $unwind: "$variant"
    },
    {
      $set: {
        "variant.color": {
          $arrayElemAt: ["$variant.color", 0]
        }
      }
    },
    {
      $limit: parseInt(req.query?.limit) || 10
    },
    {
      $skip: parseInt(req.query?.offset) || 0
    },
  ])

  const totalFiltered = await variantModel.countFiltered({
    is_active: true,
    $text: {
      $search: searchText
    }
  })

  return {
    items: products,
    meta: {
      totalFiltered
    }
  }
}

export default {
  getAll, filter, getForHomePage, detailPage, getForSearchPage
}