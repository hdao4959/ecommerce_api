import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/response.js'
import env from '../config/env.js'
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return errorResponse(res, {
      message: 'Bạn cần token để đăng nhập'
    }, 403)
  }

  const token = authHeader.split(' ')[1]

try {
  const decoded = jwt.decode(token, env.JWT_SECRET)
  req.user = decoded
  next()
} catch (error) {
  return errorResponse(res, {
    message: "Phiên đăng nhập của bạn đã hết hạn hoặc chưa đăng nhập"
  }, 403)
}
}