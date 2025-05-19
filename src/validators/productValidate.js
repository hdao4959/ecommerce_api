import Joi from "joi"

const DRAFT  = 'draft'
const PUBLISHED  = 'published'

const productValidate = Joi.object({
  name: Joi.string().min(3).max(50).required().trim().messages({
    'string.empty': "Tên sản phẩm không được để trống",
    'string.min': "Tên sản phẩm phải ít nhất 3 ký tự",
    'string.max': "Tên sản phẩm không được vượt quá 50 ký tự",
    'any.required': "Tên sản phẩm không được để trống"
  }),
  category_id: Joi.string().required().trim().messages({
    'any.required': "Bạn chưa chọn danh mục sản phẩm",
    'string.empty': "Bạn chưa chọ danh mục sản phẩm"
  }),
  variants: Joi.array(),
  is_active: Joi.boolean().default(false),
  status: Joi.string().valid(DRAFT, PUBLISHED).default(DRAFT),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})
export default productValidate