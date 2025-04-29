export const successResponse = (res, { message = "", data = {} } = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    "success": true,
    "message": message,
    "data": data,
  })
}

export const errorResponse = (res, {errors = null, message = 'Có lỗi xảy ra!'} = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    "success": false,
    "errors": errors,
    "message": message
  })
}