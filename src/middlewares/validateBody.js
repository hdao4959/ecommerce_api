import ErrorCustom from "../utils/ErrorCustom.js";
import { errorResponse } from "../utils/response.js";

const validateBody = (schema, options = {
  abortEarly: true, stripUnknown: false
}) => (req, res, next) => {
  
  if (req.method == 'POST' || req.method == "PUT") {
    if (!req.body) {
      throw new ErrorCustom('Bạn chưa chuyền dữ liệu cho Request body!', 400);
    }
  }
  
  const validationOptions = options.stripUnknown ? {
    ...options,
    allowUnknown: true
  } : options

  const { error, value } = schema.validate(req.body, validationOptions)

  if (error) {
    return errorResponse(res, { errors: error.details[0].message }, 400);
  }

  req.body = value;
  next();

}

export default validateBody