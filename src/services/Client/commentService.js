import commentModel from "../../models/commentModel.js"
import userModel, { USER_ROLE } from "../../models/userModel.js"
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js"
import ErrorCustom from "../../utils/ErrorCustom.js"
import { io, onlineUsers } from "../../server.js"
import notificationModel, { NOTIFICATION_REFERENCE_TYPE, NOTIFICATION_TYPE } from "../../models/notificationModel.js"
import productsModel from "../../models/productsModel.js"
import { client } from "../../config/mongodb.js"

const create = async (req) => {

  const session = await client.startSession()
  session.startTransaction()
  try {

    const user = req.user
    const body = req.body
    const userId = ConvertToObjectId(user.id)
    const variantId = ConvertToObjectId(body.variant_id)
    const productLine = await productsModel.findOne({
      slug: body.slug
    })

    if (!productLine) throw new ErrorCustom("Dòng sản phẩm không tồn tại")
    const variant = await variantModel.findOne({
      _id: ConvertToObjectId(body.variant_id)
    }, {
      projection: {
        name: 1
      }
    })

    if (!variant) throw new ErrorCustom("Sản phẩm không tồn tại!")
    const account = await userModel.findOne({
      _id: userId
    }, {
      projection: {
        _id: 1,
        name: 1,
        picture: 1
      }
    })

    if (!account) throw new ErrorCustom("Tài khoản không tồn tại!")

    delete (body.slug)
    const data = {
      ...body,
      user_id: userId,
      variant_id: variantId,
      created_at: Date.now()
    }



    await commentModel.create(data, { session })

    const notification = {
      type: NOTIFICATION_TYPE.comment,
      is_read: false,
      user_id: userId,
      title: `${account.name} vừa đánh giá về sản phẩm ${productLine?.name} ${variant?.name}`,
      content: data.content,
      reference_type: NOTIFICATION_REFERENCE_TYPE.comment,
      reference_id: data.variant_id,
      comment_id: data._id,
      created_at: Date.now(),
      updated_at: null,
      deleted_at: null
    }
    await notificationModel.create(notification, { session })

    const admin = await userModel.findOne({
      role: USER_ROLE.admin
    }, {
      projection: {
        _id: 1
      }
    })

    const socketId = onlineUsers.get(admin._id.toString());
    io.to(socketId).emit('notification_recent')
    await session.commitTransaction()

    return {
      ...data,
      user: account
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getListForProduct = async (req) => {
  const sortObject = {
    [req.query?.sortBy || 'created_at']: req.query?.orderBy === "asc" ? 1 : -1
  }
  const limit = parseInt(req.query?.limit) || 10
  const skip = parseInt(req.query?.offset) || 0
  const variantId = ConvertToObjectId(req.params.variantId)

  const countVariant = variantModel.countFiltered({
    _id: variantId
  })

  if (countVariant === 0) throw new ErrorCustom('Sản phẩm không tồn tại!')
  const comments = await commentModel.join([
    {
      $match: {
        variant_id: variantId
      }
    }, {
      $lookup: {
        from: userModel.COLLECTION,
        let: {
          userId: '$user_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', "$$userId"]
              }
            }
          }, {
            $project: {
              _id: 1,
              name: 1,
              picture: 1
            }
          }
        ],
        as: 'user'
      }
    }, {
      $project: {
        updated_at: 0,
        deleted_at: 0
      }
    }, {
      $unwind: "$user"
    }, {
      $sort: sortObject
    }, {
      $skip: skip
    }
    , {
      $limit: limit
    }])


  return comments
}

const deleteComment = async (req) => {
  const session = await client.startSession()
  try {
    session.startTransaction()
    const idComment = ConvertToObjectId(req.params.id)
    const idUser = req.user.id
    const existComment = await commentModel.findOne({
      _id: idComment
    })

    if (!existComment) throw new ErrorCustom('Comment không tồn tại!')


    if (idUser !== existComment?.user_id?.toString()) throw new ErrorCustom("Bạn không thể xoá comment này")

    await commentModel.destroy({
      _id: idComment
    }, {
      session
    })
    await notificationModel.destroy({
      comment_id: idComment
    }, {
      session
    })
    await session.commitTransaction()

  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const averageVote = () => {
  
}
export default {
  create, getListForProduct, deleteComment
}