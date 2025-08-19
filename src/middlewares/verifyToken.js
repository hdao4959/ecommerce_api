import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/response.js'
import env from '../config/env.js'
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, {
      message: 'Bạn chưa đăng nhập vào hệ thống!'
    }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return errorResponse(res, {
      message: "Bạn chưa đăng nhập vào hệ thống!"
    }, 401)
  }

  try {
    const decoded = jwt.decode(token, env.JWT_SECRET)

    if (decoded) {
      req.user = decoded
    } else {
      return errorResponse(res, {
        message: "Token không hợp lệ hoặc đã hết hạn!"
      }, 403)
    }
    next()
  } catch (error) {
    return errorResponse(res, {
      message: "Phiên đăng nhập của bạn đã hết hạn hoặc chưa đăng nhập"
    }, 403)
  }
}

export const decodeToken = (req) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(' ')[1]
  if (!token) return null
  const decoded = jwt.decode(token, env.JWT_SECRET)
  return decoded
}