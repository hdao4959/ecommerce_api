import Joi from 'joi'

const DRAFT  = 'draft'
const PUBLISHED  = 'published'

const colorValidate = Joi.object({
  name: Joi.string().min(2).max(20).trim().required().messages({
    'any.required': 'Bạn chưa nhập tên màu sắc',
    'string.empty': 'Tên màu sắc không được để trống',
    'string.min': 'Tên màu sắc tối thiểu 2 kí tự',
    'string.max': 'Tên màu sắc tối đa 20 kí tự',
  }),
  status: Joi.string().valid(DRAFT, PUBLISHED).default(DRAFT).messages({
    'any.only': 'Trạng thái có định dạng không hợp lệ!',
    'string.base': 'Trạng thái có định dạng không hợp lệ!'
  }),
  is_active: Joi.boolean().default(true),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default colorValidate