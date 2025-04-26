import Joi from "joi"
import { ObjectId } from "mongodb"

const categoryValidate = Joi.object({
  name: Joi.string().min(3).max(20).trim().required()
  .messages({
    'string.empty': "Tên danh mục không được để trống",
    'string.min': "Tên danh mục phải ít nhất 3 ký tự",
    'string.max': "Tên danh mục tối thiểu 20 ký tự",
    'any.required': "Tên danh mục không được để trống"
  }),
  parent_id: Joi.any().custom((value, helpers) => {
    if(value === null || value === "" || value === undefined) return null
    try {
      return new ObjectId(value)
    } catch (error) {
      return helpers().error('parentId.invalid')
    }
  }).message({
    'parentId.invalid': 'Danh mục cha không hợp lệ'
  }),
  is_active: Joi.boolean()
})
export default categoryValidate