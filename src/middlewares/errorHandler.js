import { errorResponse } from "../utils/response.js"

const errorHandler   = (err, req, res, next) => {
  
  return errorResponse(res, {errors: err.message}, err.statusCode || 500)
}
export default errorHandler