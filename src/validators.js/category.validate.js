import Joi from "joi"

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(20).trim().required()
  .messages({
    'string.empty': "Tên danh mục không được để trống",
    'string.min': "Tên danh mục phải ít nhất 3 ký tự",
    'string.max': "Tên danh mục tối thiểu 20 ký tự",
    'any.required': "Tên danh mục không được để trống"
  })

  
})
export default categorySchema