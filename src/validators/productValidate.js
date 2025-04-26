import Joi from "joi"

const ProductValidate = Joi.object({
  'name': Joi.string().min(3).max(50).required().trim().messages({
    'string.empty': "Tên sản phẩm không được để trống",
    'string.min': "Tên sản phẩm phải ít nhất 3 ký tự",
    'string.max': "Tên sản phẩm tối thiểu 50 ký tự",
    'any.required': "Tên sản phẩm không được để trống"
  })
})
export default ProductValidate