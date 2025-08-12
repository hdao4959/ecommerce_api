import { errorResponse } from "../utils/response.js"

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req?.user?.role === "admin") {
      return errorResponse(res, {
        message: "Bạn không có quyền truy cập vào hệ thống!"
      }, 403)
    }

    next()
  } catch (error) {
    return errorResponse(res, {
      message: "Bạn không thể đăng nhập vào hệ thống"
    }, 403)
  }
}

