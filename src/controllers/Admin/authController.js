import { successResponse } from "../../utils/response.js"
import authService from "../../services/Admin/authService.js"

const loginWithEmail = async (req, res, next) => {
  try {
    const result = await authService.loginWithEmail(req.body)

    return successResponse(res, {
      message: 'Đăng nhập thành công',
      data: {
        ...result
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  loginWithEmail
}