import { errorResponse } from "../utils/response.js"

export const errorHandler   = (err, req, res, next) => {
  console.log(err);
  
  return errorResponse(res, {errors: err.message}, err.statusCode || 500) 
  
}
