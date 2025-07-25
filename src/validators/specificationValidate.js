import Joi from 'joi'

const specificationValidate = Joi.object({
  name: Joi.string().min(2).max(40).trim().required().messages({
    'any.required': 'Bạn chưa nhập tên thông số',
    'string.empty': 'Tên thông số không được để trống',
    'string.min': 'Tên thông số tối thiểu 2 kí tự',
    'string.max': 'Tên thông số tối đa 40 kí tự',
  }),
  is_active: Joi.boolean().default(true),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default specificationValidate