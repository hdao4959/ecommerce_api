import { errorResponse } from "../utils/response.js";

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: true })
  
  if (error) {
    return errorResponse(res, {errors: error.details} ,500);
  }

  req.body = value;
  next();

}

export default validateBody