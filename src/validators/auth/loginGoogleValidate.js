import Joi from "joi";

const loginGoogleValidate = Joi.object({
  'token': Joi.string().required().trim().message({
    'string.empty': 'Token không hợp lệ!',
    'any.required': 'Bạn chưa gửi token lên!'
  }),
  is_active: Joi.boolean().default(true),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default loginGoogleValidate