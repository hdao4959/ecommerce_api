import { client } from "../../config/mongodb.js";
import categoryModel from "../../models/categoryModel.js";
import productsModel from "../../models/productsModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import variantModel from "../../models/variantModel.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const getAll = async () => {
  return await categoryModel.getAll();
}

const getAllWithMetadata = async (query = {}) => {
  let conditions = [{
    parent_id: null
  }]
  if (query && query.active) {
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
  if (query.search) {
    conditions.push({
      $or: [
        {
          name: {
            $regex: query.search.trim(), $options: "i"
          }
        }
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const parentCategories = await categoryModel.getAll({ conditions, query })

  const seenParentIds = new Set()
  const parentIds = []

  parentCategories.forEach(parent => {
    const stringParentId = parent._id.toString();
    if (!seenParentIds.has(stringParentId)) {
      seenParentIds.add(stringParentId);
      parentIds.push(ConvertToObjectId(stringParentId));
    }
  })

  const childrenCategory = await categoryModel.filter({
    filter: {
      parent_id: { $in: parentIds }
    }
  })

  const categories = parentCategories.map(parent => {
    const childrenOfParent = childrenCategory.filter(child => child.parent_id.toString() == parent._id.toString())
    return {
      ...parent,
      children: childrenOfParent
    }
  })

  const total = await categoryModel.countAll();
  const totalFiltered = await categoryModel.countFiltered(conditions)
  return {
    items: categories,
    meta: {
      total,
      totalFiltered
    }
  }
}

const getDetail = async (id) => {
  const category =  await categoryModel.join([
    {
      $match: {
        $expr: {
          $eq: ['$_id', ConvertToObjectId(id)]
        }
      }
    }, {
      $lookup: {
        from: categoryModel.COLLECTION,
        localField: 'parent_id',
        foreignField: '_id',
        as: 'parent'
      }
    }, {
      $unwind: {
        path: '$parent',
        preserveNullAndEmptyArrays: true
      }
    }
  ]);
  
  return {
    ...category[0]
  }

}

const create = async (data) => {

  const exist = await categoryModel.findBy({ name: data?.name });

  if (exist) {
    throw new ErrorCustom('Tên danh mục đã tồn tại!', 400)
  }

  if (data.parent_id) {
    const existParentCategory = await categoryModel.findById(data.parent_id);
    if (!existParentCategory) {
      throw new ErrorCustom('Danh mục cha không tồn tại!', 404)
    }
  }

  return await categoryModel.create(data);
}

const update = async (id, data) => {
  
  const exist = await categoryModel.findById(id);
  if (!exist) {
    throw new ErrorCustom('Danh mục này không tồn tại!')
  }
  
  const existName = await categoryModel.findBy({
    name: data?.name,
    _id: {
      $ne: ConvertToObjectId(id)
    }
  })


  if (existName) {
    throw new ErrorCustom('Tên danh mục này đã tồn tại!')
  }

  if (data?.parent_id) {
    const existParentCategory = await categoryModel.findById(data.parent_id);

    if (!existParentCategory) {
      throw new Error('Danh mục cha không tồn tại!')
    }
  }
  return await categoryModel.updateById(id, data);
}

const findById = async (id) => {
  const result = await categoryModel.findById(id);
  if (!result) throw new ErrorCustom("Không tìm thấy danh mục sản phẩm");
  return result
}


const destroy = async (id) => {
  const session = await client.startSession()
  session.startTransaction();
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      throw new ErrorCustom('Danh mục không tồn tại!', 404);
    }

    if (category?.type == 'not_delete') {
      throw new ErrorCustom('Danh mục này không thể xoá!', 419)
    }
    // Xoá các danh mục con
    await categoryModel.deleteMany({
      conditions: {
        parent_id: ConvertToObjectId(id)
      },
      options: {
        session
      }
    });
    // Xoá danh mục 
    await categoryModel.deleteById(id, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const productsOfCategory = async (query, id) => {
  if (!id) return null
  const category = await categoryModel.findById(ConvertToObjectId(id));
  if (!category) throw new ErrorCustom('Danh mục này không tồn tại', 404);

  const products = await productsModel.join(
    [
      {
        $lookup: {
          from: 'variants',
          let: {
            productId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$product_id', '$$productId'],
                }
              }
            },
            {
              $lookup: {
                from: 'variant_color',
                localField: '_id',
                foreignField: 'variant_id',
                as: 'colors'
              }
            },
            {
              $project: {
                is_active: 0
              }
            },
          ],
          as: 'variants',
        }
      },
      {
        $skip: parseInt(query?.offset) || 0
      }, {
        $limit: parseInt(query?.limit) || 10
      },
      {
        $project: {
          is_active: 0,
          status: 0,
          created_at: 0,
          updated_at: 0,
          deleted_at: 0
        }
      }
    ]
  )

  return {
    category,
    products
  }
}

const getChildrenCategory = async (parentId) => {

  const parentCategory = await categoryModel.findById(parentId);
  if (!parentCategory) {
    throw new ErrorCustom('Danh mục cha không tồn tại!', 404)
  }
  const childrenCategory = await categoryModel.filter({
    filter: {
      parent_id: ConvertToObjectId(parentId)
    }
  });

  return {
    'parentCategory': parentCategory,
    'childrenCategory': childrenCategory
  }
}

const getParentCategory = async (id) => {
  return await categoryModel.findById(id);
}


export default {
  getAll,
  getAllWithMetadata,
  getDetail,
  create,
  update,
  productsOfCategory,
  findById,
  destroy,
  getChildrenCategory,
  getParentCategory
}