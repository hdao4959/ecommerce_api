import Joi from 'joi'

const DRAFT  = 'draft'
const PUBLISHED  = 'published'

const colorValidate = Joi.object({
  name: Joi.string().min(3).max(20).trim().required().messages({
    'any.required': 'Bạn chưa nhập tên màu sắc',
    'string.empty': 'Tên màu sắc không được để trống',
    'string.min': 'Tên màu sắc tối thiểu 3 kí tự',
    'string.max': 'Tên màu sắc tối đa 20 kí tự',
  }),
  variant_id: Joi.string().trim().required().messages({
    'any.required': 'Bạn chưa chọn biến thể sản phẩm',
    'string.empty': 'Biến thể sản phẩm không được để trống'
  }),
  price: Joi.string().pattern(/^\d+$/).default(0).messages({
    'string.pattern.base': 'Giá phải là số nguyên không âm',
  }),
  stock: Joi.string().pattern(/^\d+$/).default(0).messages({
    'string.pattern.base': 'Số lượng phải là số nguyên không âm',
  }),
  status: Joi.string().valid(DRAFT, PUBLISHED).default(DRAFT).messages({
    'any.only': 'Trạng thái có định dạng không hợp lệ!',
    'string.base': 'Trạng thái có định dạng không hợp lệ!'
  }),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default colorValidate