import { errorResponse } from "../utils/response.js"

export const errorHandler   = (err, req, res, next) => {
  return errorResponse(res, {errors: err.message , stack: err.stack }, err.statusCode || 500) 
}
