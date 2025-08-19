import commentService from "../../services/Client/commentService.js";
import { successResponse } from "../../utils/response.js";

const create = async (req, res, next) => {
  try {
    const comment = await commentService.create(req)
    return successResponse(res, {
      message: 'Viết đánh giá thành công!',
      data: {
        comment
      }
    })
  } catch (error) {
    next(error)
  }
}

const getListForProduct = async (req, res, next) => {
  try {
    const comments = await commentService.getListForProduct(req)
    return successResponse(res, {
      data: {
        comments
      }
    })
  } catch (error) {
    next(error)
  }
}

const deleteComment = async(req, res, next) => {
  try {
    await commentService.deleteComment(req);
    return successResponse(res, {
      message: "Xoá comment thành công!"
    })
  } catch (error) {
    next(error)
  }
}

// const averageVote = async (req, res, next) => {
//   try {
//     const averageVote = commentService.averageVote(req)
//   } catch (error) {
//     next(error)
//   }
// }
export default {
  create, getListForProduct, deleteComment
}