export const successResponse = (res, { message = "", data = {} } = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    "message": message,
    "data": data,
  })
}

export const errorResponse = (res, {errors = null, message = 'Có lỗi xảy ra'} = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    "errors": errors,
    "message": message
  })
}