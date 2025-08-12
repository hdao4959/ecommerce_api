import Joi from 'joi'
import { LOGIN_TYPE, USER_ROLE } from '../models/userModel.js'

const register = Joi.object({
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
  password: Joi.string().min(6).trim().required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Bạn chưa nhập mật khẩu',
    'string.min': 'Mật khẩu phải chứa tối thiểu 6 ký tự'
  }),
  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Mật khẩu xác nhận không đúng',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Bạn chưa nhập mật khẩu',
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
  login_type: Joi.valid(LOGIN_TYPE.email, LOGIN_TYPE.google).default(LOGIN_TYPE.email),
  role: Joi.valid(USER_ROLE.client, USER_ROLE.admin).default(USER_ROLE.client),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default {
  register
}