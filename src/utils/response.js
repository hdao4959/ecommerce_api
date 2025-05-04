import env from "../config/env.js"

export const successResponse = (res,
  { message = "", data = {} } = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    "success": true,
    "message": message,
    "data": data,
  })
}

export const errorResponse = (res,
  { errors = null, message = 'Có lỗi xảy ra!', stack = "" } = {}, statusCode = 500) => {
  const response = {
    "success": false,
    "errors": errors,
    "message": message,
  }

  if(env.BUILD_MODE == 'dev') response.stack = stack
  
  return res.status(statusCode).json(response)
}