import Joi from "joi"

const DRAFT = 'draft'
const PUBLISHED = 'published'

const variantValidate = Joi.object({
  variant: Joi.object({
    name: Joi.string().required().trim().min(3).max(20).messages({
      'any.required': 'Bạn chưa nhập tên cho biến thể!',
      'string.empty': 'Tên biến thể không được để trống!',
      'string.min': 'Tên biến thể tối thiểu 3 kí tự!',
      'string.max': 'Tên biến thể tối đa 20 kí tự!',
    }),
    product_id: Joi.string().required().trim().messages({
      'any.required': 'Bạn chưa chọn dòng sản phẩm cho biến thể!',
      'string.empty': "Dòng sản phẩm không được để trống!"
    }),
    description: Joi.string().allow('').default(''),
    is_active: Joi.string().valid(true, false).default(true).messages({
      'any.only': 'Trạng thái có định dạng không hợp lệ!',
      'string.base': 'Trạng thái có định dạng không hợp lệ!'
    }),
  }),
  specifications: Joi.array().required().items(Joi.object({
    _id: Joi.string().trim().required().messages({
      'any.required': 'Bạn chưa chọn thông số!',
      'string.empty': 'Thông số không hộp lệ!'
    }),
    value: Joi.string().trim().required().messages({
      'any.required': 'Bạn chưa nhập giá trị cho thông số!',
      'string.empty': 'Giá trị thông số không hợp lệ!'
    })
  })).messages({
    'array.base': 'Mảng thông số kĩ thuật không hợp lệ!'
  }),
  colors: Joi.array().required().items(Joi.object({
    _id: Joi.string().trim(),
    color_id: Joi.string().trim().required().messages({
      'any.required': 'Màu sắc không xác định!',
      'string.empty': 'Màu sắc không xác định!'
    }),
    price: Joi.number().min(1).max(1000000000).required().messages({
      'any.required': 'Giá không được để trống!',
      'number.base': 'Giá không hợp lệ!',
      'number.min': 'Giá tối thiểu từ 1 trở lên!',
      'number.max': 'Giá tối đa 1000.000.000!'
    }),
    stock: Joi.number().min(1).required().messages({
      'any.required': 'Số lượng không được để trống!',
      'number.base': 'Số lượng không hợp lệ!',
      'number.min': 'Số lượng tối thiểu là 1!'
    }),
    image: Joi.object().messages({
      'any.required': 'Bạn chưa cung cấp hình ảnh!',
      'object.base': 'Dữ liệu hình ảnh không hợp lệ!',
    }),
    is_active: Joi.boolean().default(false)
  })),
  created_at: Joi.date().timestamp('javascript').default(() => Date.now()),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null),
})

export default variantValidate