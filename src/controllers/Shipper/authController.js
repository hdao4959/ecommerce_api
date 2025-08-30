import authService from "../../services/Shipper/authService.js"
import { successResponse } from "../../utils/response.js";

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, {
      data: {
        ...result
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  login
}