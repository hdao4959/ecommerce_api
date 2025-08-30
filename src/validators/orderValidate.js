import Joi from "joi"
const orderValidate = Joi.object({
  firebaseToken:  Joi.string().required(),
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'Họ và tên không được để trống',
    'any.required': 'Bạn chưa nhập họ và tên',
    'string.min': 'Họ và tên tối thiểu 3 ký tự',
    'string.max': 'Họ và tên tối đa 30 ký tự'
  }),
  phoneNumber: Joi.string().trim().min(8).max(20).required().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'any.required': 'Bạn chưa nhập số điện thoại',
    'string.min': 'Số điện thoại tối thiểu 8 ký tự',
    'string.max': 'Số điện thoại tối đa 20 ký tự'
  }),
  email: Joi.string().trim(),
  provinceCode: Joi.string().required().messages({
    'string.empty': 'Mã thành phố không được để trống',
    'any.required': 'Bạn chưa cung cấp mã thành phố',
  }),
  provinceName: Joi.string().required().messages({
    'string.empty': 'Tên thành phố không được để trống',
    'any.required': 'Bạn chưa cung cấp tên thành phố',
  }),
  districtCode: Joi.string().required().messages({
    'string.empty': 'Mã quận/huyện không được để trống',
    'any.required': 'Bạn chưa cung cấp mã quận/huyện',
  }),
  districtName: Joi.string().required().messages({
    'string.empty': 'Tên quận/huyện không được để trống',
    'any.required': 'Bạn chưa cung cấp tên quận/huyện',
  }),
  wardCode: Joi.string().required().messages({
    'string.empty': 'Mã phường/xã không được để trống',
    'any.required': 'Bạn chưa cung cấp mã phường/xã',
  }),
  wardName: Joi.string().required().messages({
    'string.empty': 'Tên phường/xã không được để trống',
    'any.required': 'Bạn chưa cung cấp tên phường/xã',
  }),
  addressDetail: Joi.string().required().messages({
    'string.empty': 'Địa chỉ chi tiết không được để trống',
    'any.required': 'Bạn chưa cung cấp thông tin địa chỉ chi tiết',
  }),
  lng: Joi.number().required().messages({
    'string.empty': 'Kinh độ không được để trống',
    'any.required': 'Bạn chưa cung cấp kinh độ',
  }),
  lat: Joi.number().required().messages({
    'string.empty': 'Vĩ độ không được để trống',
    'any.required': 'Bạn chưa cung cấp vĩ độ',
  }),
  note: Joi.string().trim().allow(''),
  items: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      quantity: Joi.number().min(1).required()
    })
  ).min(1).required().messages({
    'array.base': 'Giỏ hàng không hợp lệ',
    'array.min': 'Giỏ hàng phải ít nhất 1 sản phẩm',
    'any.required': 'Giỏ hàng là bắt buộc'
  }),
  amount: Joi.number().required().messages({
    'number.base': 'Số tiền không hợp lệ',
    'any.required': 'Thiếu thông tin số tiền'
  }),
  bankCode: Joi.string().allow(''),
  orderDescription: Joi.string().allow(''),
  orderType: Joi.string().allow(''),
  language: Joi.string().allow('')
}
)

export default orderValidate