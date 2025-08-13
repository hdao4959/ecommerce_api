import jwt from 'jsonwebtoken'
import env from '../config/env.js'
const createToken = (payload = {}, duration = "1d") => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: duration
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET)
} 

export default {
  createToken, verifyToken
}