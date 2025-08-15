import Joi from 'joi'

const create = Joi.object({
  slug: Joi.string().trim().required().messages({
    'any.required': 'Dòng sản phẩm không xác định!',
    'string.empty': 'Dòng sản phẩm không tồn tại!'
  }),
  variant_id: Joi.string().trim().required().messages({
    'any.required': 'Sản phẩm không hợp lệ!',
    'string.empty': 'Sản phẩm không hợp lệ!'
  }),
  comment: Joi.string().trim().required().messages({
    'any.required': "Bạn chưa nhập đánh giá!",
    'string.empty': 'Bạn chưa nhập đánh giá!'
  }),
  vote: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    'any.only': "Vote không hợp lệ!"
  }),
  badges: Joi.array().items(Joi.number()).default([]),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default { create }