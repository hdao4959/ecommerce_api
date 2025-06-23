import Joi from 'joi'

const userValidate = Joi.object({
  name: Joi.string().min(3).max(30).trim().required().messages({
    'string.empty': 'Tên tài khoản không được để trống',
    'any.required': 'Bạn chưa nhập tên tài khoản',
    'string.min': 'Tên tài khoản phải chứa ít nhất 3 ký tự',
    'string.max': 'Tên tài khoản không quá 30 ký tự'
  }),
  email: Joi.string().email().max(254).trim().required().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Bạn chưa nhập Email',
    'string.max': 'Email không được vượt quá 254 ký tự',
    'string.email': 'Email không hợp lệ'
  }),
  phone_number: Joi.string().pattern(/^[0-9]{10,11}$/).trim().required().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'any.required': 'Bạn chưa nhập Số điện thoại',
    'string.pattern.base': 'Số điện thoại không hợp lệ'
  }),
  province: Joi.number().default(null).messages({
    'number.base': "Mã tỉnh không hợp lệ"
  }),
  district: Joi.number().default(null).messages({
    'number.base': "Mã Quân/huyện không hợp lệ"
  }),
  ward: Joi.number().default(null).messages({
    'number.base': "Mã Phường/xã không hợp lệ"
  }),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default userValidate