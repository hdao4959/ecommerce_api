import Joi from "joi"
const orderValidate = Joi.object({
  firebaseToken:  Joi.string().required(),
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'Họ và tên không được để trống',
    'any.required': 'Bạn chưa nhập họ và tên',
    'string.min': 'Họ và tên tối thiểu 3 ký tự',
    'string.max': 'Họ và tên tối đa 30 ký tự'
  }),
  phoneNumber: Joi.string().trim().min(8).max(12).required().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'any.required': 'Bạn chưa nhập số điện thoại',
    'string.min': 'Số điện thoại tối thiểu 8 ký tự',
    'string.max': 'Số điện thoại tối đa 12 ký tự'
  }),
  email: Joi.string().trim(),
  province: Joi.string().required().messages({
    'string.empty': 'Thành phố không được để trống',
    'any.required': 'Bạn chưa chọn thành phố',
  }),
  district: Joi.string().required().messages({
    'string.empty': 'Quận/huyện không được để trống',
    'any.required': 'Bạn chưa chọn quận/huyện',
  }),
  ward: Joi.string().required().messages({
    'string.empty': 'Phường/xã không được để trống',
    'any.required': 'Bạn chưa chọn phường/xã',
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