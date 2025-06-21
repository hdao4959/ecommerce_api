import userService from "../../services/Admin/userService.js";
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll(req.query);
    return successResponse(res, {
      data: {
        users: users
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAll
}