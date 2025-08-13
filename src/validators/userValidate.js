import Joi from 'joi'
import { LOGIN_TYPE, USER_ROLE } from '../models/userModel.js'

const register = Joi.object({
  name: Joi.string().min(3).max(30).trim().default(() => `user_${Date.now()}${Math.random().toString(36).substring(2,8)}`).messages({
    'string.min': 'Tên tài khoản phải chứa ít nhất 3 ký tự',
    'string.max': 'Tên tài khoản không quá 30 ký tự'
  }),
  email: Joi.string().email().max(254).trim().default(null).messages({
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
  login_type: Joi.valid(LOGIN_TYPE.email, LOGIN_TYPE.google, LOGIN_TYPE.phone_number).required(),
  role: Joi.valid(USER_ROLE.client, USER_ROLE.admin).default(USER_ROLE.client),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

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

const login = Joi.object({
  "phone_number": Joi.string().trim().required().messages({
    'string.empty': 'Số điện thoại không được để trống!',
    'any.required': 'Bạn chưa nhập số điện thoại!'
  }),
  'password': Joi.string().trim().required().messages({
    'any.required': 'Bạn chưa nhập mật khẩu!',
    'string.empty': 'Mật khẩu không được để trống'
  })
})

export default {
  register, loginGoogleValidate, login
}