import Joi from "joi"

const DRAFT  = 'draft'
const PUBLISHED  = 'published'

const variantValidate = Joi.object({
  name: Joi.string().required().trim().min(3).max(20).messages({
    'any.required': 'Bạn chưa nhập tên cho biến thể!',
    'string.empty': 'Tên biến thể không được để trống!',
    'string.min': 'Tên biến thể tối thiểu 3 kí tự!',
    'string.max': 'Tên biến thể tối đa 20 kí tự!',
  }),
  product_line_id: Joi.string().required().trim().messages({
    'any.required': 'Bạn chưa chọn dòng sản phẩm cho biến thể!',
    'string.empty': "Dòng sản phẩm không được để trống!"
  }),
  description: Joi.string().allow('').default(''),
  status: Joi.string().valid(DRAFT, PUBLISHED).default(DRAFT).messages({
    'any.only': 'Trạng thái có định dạng không hợp lệ!',
    'string.base': 'Trạng thái có định dạng không hợp lệ!'
  }),
  colors: Joi.array().items(Joi.string()),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default variantValidate