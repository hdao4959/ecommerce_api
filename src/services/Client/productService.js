import productsModel from "../../models/productsModel.js";

const getAll = async ({ query = {}, projection = {} }) => {
  return await productsModel.getAll({ query, projection });
}

const getForHomePage = async (query) => {
  const categories = ['Samsung','Iphone', 'MacBook'];
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
                        $eq: ['$variant_id', '$$variantId']
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

const findOneBy = async ({ payload = {}, projection = {} }) => {
  return await productsModel.findOneBy({ payload, projection });
}

const filter = async ({ filter = {}, projection = {} }) => {
  return await productsModel.filter({ filter, projection })
}
export default {
  getAll, findOneBy, filter, getForHomePage
}